import { PAGINATION } from '@/constant/pagination';
import { NodeType } from '@/generated/prisma/enums';
import {
  createTRPCRouter,
  premiumProcedure,
  protectedProcedure,
} from '@/integrations/trpc/init';
import db from '@/lib/db';
import type { Edge, Node } from '@xyflow/react';
import { generateSlug } from 'random-word-slugs';
import z from 'zod';

export const workflowsRouter = createTRPCRouter({
  create: premiumProcedure.mutation(async ({ ctx }) => {
    return await db.workflow.create({
      data: {
        name: generateSlug(3),
        userId: ctx.auth.user.id,
        nodes: {
          create: {
            name: NodeType.INITIAL,
            position: { y: 0, x: 0 },
            type: NodeType.INITIAL,
          },
        },
      },
    });
  }),

  remove: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await db.workflow.delete({
        where: {
          id: input.id,
          userId: ctx.auth.user.id,
        },
      });
    }),

  updateName: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await db.workflow.update({
        where: {
          id: input.id,
          userId: ctx.auth.user.id,
        },
        data: {
          name: input.name,
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        nodes: z.array(
          z.object({
            id: z.string(),
            type: z.string().nullish(),
            position: z.object({ x: z.number(), y: z.number() }),
            data: z.record(z.string(), z.any().optional()),
          })
        ),
        edges: z.array(
          z.object({
            source: z.string(),
            target: z.string(),
            sourceHandle: z.string().nullish(),
            targetHandle: z.string().nullish(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { edges, id, nodes } = input;
      const workflow = await db.workflow.findUniqueOrThrow({
        where: { id, userId: ctx.auth.user.id },
      });

      return await db.$transaction(async (tx) => {
        await tx.node.deleteMany({ where: { workflowId: id } });

        await tx.node.createMany({
          data: nodes.map((n) => ({
            id: n.id,
            workflowId: id,
            name: n.type || 'unknown',
            position: n.position,
            type: n.type as NodeType,
            data: n.data || {},
          })),
        });

        await tx.connection.createMany({
          data: edges.map((c) => ({
            workflowId: id,
            fromNodeId: c.source,
            toNodeId: c.target,
            fromOutput: c.sourceHandle || 'main',
            toInput: c.targetHandle || 'main',
          })),
        });

        await tx.workflow.update({
          where: { id },
          data: { updatedAt: new Date() },
        });

        return workflow;
      });
    }),

  getOne: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const workflow = await db.workflow.findUniqueOrThrow({
        where: {
          id: input.id,
          userId: ctx.auth.user.id,
        },
        include: { nodes: true, connections: true },
      });

      const nodes: Node[] = workflow.nodes.map((node) => ({
        id: node.id,
        name: node.name,
        type: node.type,
        data: (node.data as Record<string, unknown>) || {},
        position: node.position as { x: number; y: number },
      }));

      const edges: Edge[] = workflow.connections.map((connection) => ({
        id: connection.id,
        source: connection.fromNodeId,
        target: connection.toNodeId,
        sourceHandle: connection.fromOutput,
        targetHandle: connection.toInput,
      }));

      return {
        id: workflow.id,
        name: workflow.name,
        nodes,
        edges,
      };
    }),

  getMany: protectedProcedure
    .input(
      z.object({
        page: z.number().default(PAGINATION.DEFAULT_PAGE),
        pageSize: z
          .number()
          .min(PAGINATION.MIN_PAGE_SIZE)
          .max(PAGINATION.MAX_PAGE_SIZE)
          .default(PAGINATION.DEFAULT_PAGE_SIZE),
        search: z.string().default(''),
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, pageSize, search } = input;

      const [items, totalCount] = await Promise.all([
        await db.workflow.findMany({
          skip: (page - 1) * pageSize,
          take: pageSize,
          where: {
            userId: ctx.auth.user.id,
            name: {
              contains: search,
              mode: 'insensitive',
            },
          },
          orderBy: {
            updatedAt: 'desc',
          },
        }),

        await db.workflow.count({
          where: {
            userId: ctx.auth.user.id,
            name: {
              contains: search,
              mode: 'insensitive',
            },
          },
        }),
      ]);

      const totalPages = Math.ceil(totalCount / pageSize);
      const hasNextPage = page < totalPages;
      const hasPrevPage = page > 1;

      return {
        page,
        pageSize,
        totalPages,
        hasNextPage,
        hasPrevPage,
        items,
      };
    }),
});

import { NodeStatus } from '@/components/react-flow/node-status-indicator';
import { Realtime } from '@inngest/realtime';
import { useInngestSubscription } from '@inngest/realtime/hooks';
import { useEffect, useState } from 'react';

type UseNodeStatusOptions = {
  nodeId: string;
  channel: string;
  topic: string;
  refreshToken: () => Promise<Realtime.Subscribe.Token>;
};

export function useNodeStatus({
  channel,
  nodeId,
  refreshToken,
  topic,
}: UseNodeStatusOptions) {
  const [nodeStatus, setNodeStatus] = useState<NodeStatus>('initial');
  const { data } = useInngestSubscription({ refreshToken, enabled: true });

  useEffect(() => {
    if (data?.length === 0) return;

    const latestMessage = data
      .filter(
        (msg) =>
          msg.channel === channel &&
          msg.kind === 'data' &&
          msg.topic === topic &&
          msg.data.nodeId === nodeId
      )
      .sort((a, b) => {
        if (a.kind === 'data' && b.kind === 'data') {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        }
        return 0;
      })[0];

    if (latestMessage?.kind === 'data') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setNodeStatus(latestMessage.data.status as NodeStatus);
    }
  }, [channel, data, nodeId, topic]);

  return nodeStatus;
}

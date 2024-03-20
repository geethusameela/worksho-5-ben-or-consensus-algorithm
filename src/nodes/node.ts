import express, { Request, Response } from 'express';
import { BASE_NODE_PORT } from '../config';
import { Value } from '../types';

// Define NodeState type
type NodeState = {
  killed: boolean;
  x: 0 | 1 | "?" | null;
  decided: boolean | null;
  k: number | null;
};

export async function node(
  nodeId: number,
  N: number,
  F: number,
  initialValue: Value,
  isFaulty: boolean,
  nodesAreReady: () => boolean,
  setNodeIsReady: (index: number) => void
) {
  const node = express();
  node.use(express.json());

  // Implement the /status route
  node.get('/status', (req: Request, res: Response) => {
    if (isFaulty) {
      res.status(500).send('faulty');
    } else {
      res.status(200).send('live');
    }
  });

  // Implement the /getState route
  node.get('/getState', (req: Request, res: Response) => {
    const state: NodeState = {
      killed: false,
      x: isFaulty ? null : initialValue,
      decided: isFaulty ? null : false,
      k: isFaulty ? null : 0
    };
    res.json(state);
  });

  const server = node.listen(BASE_NODE_PORT + nodeId, async () => {
    console.log(`Node ${nodeId} is listening on port ${BASE_NODE_PORT + nodeId}`);
    setNodeIsReady(nodeId);
  });

  return server;
}

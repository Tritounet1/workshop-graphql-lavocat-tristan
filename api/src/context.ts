import http from "http";
import { getTokenData } from "./utils/utils";
import { PubSub } from "graphql-subscriptions";

const pubsub = new PubSub();

export async function contextFromRequest(
    request: http.IncomingMessage
) {
    const authorization = request.headers["authorization"];
    if(authorization) {
        return {
            pubsub: pubsub,
            user: getTokenData(authorization),
        };
    }
}

export async function contextFromConnectionParams(
    connectionParams: Record<string, unknown>
) {
    const authorization = connectionParams["Authorization"]?.toString();
    if(authorization) {
        return {
            pubsub: pubsub,
            user: getTokenData(authorization),
        };
    }
}
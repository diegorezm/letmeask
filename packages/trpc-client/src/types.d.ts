import type { AppRouter } from "@letmeask/api/router";
import type { inferRouterOutputs } from "@trpc/server";

type RouterOutputs = inferRouterOutputs<AppRouter>;

export type RoomsFindAllOutput = RouterOutputs["rooms"]["findAll"];
export type RoomsFindByIdOutput = RouterOutputs["rooms"]["findById"];

export type QuestionsFindByRoomIdOutput =
	RouterOutputs["questions"]["findByRoomId"];

export type QuestionsFindByIdOutput = RouterOutputs["questions"]["findById"];

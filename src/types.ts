import { TaskStatusEnum } from "./constants"

export type TStatus = TaskStatusEnum.NEW | TaskStatusEnum.REVIEW | TaskStatusEnum.REWORK | TaskStatusEnum.DONE

export type TTableRow = [name: string, lastName: string, task: string, status: TStatus | "Статус"]
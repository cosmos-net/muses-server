import { ICommand } from "@lib-commons/domain";

export interface IApplicationServiceCommand<
  CommandBase extends ICommand = ICommand,
> {
  process<T extends CommandBase>(
    command: T,
  ): Promise<unknown> | Promise<void> | void;
}

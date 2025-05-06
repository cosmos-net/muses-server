import { ICommand } from '@core/domain/contracts/presentation/command';

export interface IApplicationServiceCommand<CommandBase extends ICommand = ICommand> {
  process<T extends CommandBase>(command: T): Promise<unknown> | Promise<void> | void;
}

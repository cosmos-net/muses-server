import { ICommand } from '@management-commons/domain/contracts/command';

export interface IApplicationServiceCommand<CommandBase extends ICommand = ICommand> {
  process<T extends CommandBase>(command: T): Promise<any>;
}

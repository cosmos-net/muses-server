import { ICommand } from '@management-commons/domain/contracts/presentation/command';

export interface IApplicationServiceCommand<CommandBase extends ICommand = ICommand> {
  process<T extends CommandBase>(command: T): Promise<any>;
}

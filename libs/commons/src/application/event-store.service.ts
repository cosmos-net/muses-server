import { IDomainEvent } from '@lib-commons/domain/contracts/event/domain-event';
import { IEventStore } from '@lib-commons/domain/contracts/event/event-store';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class EventStoreService implements IEventStore {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  async emit(data: IDomainEvent): Promise<any[]> {
    return await this.eventEmitter.emitAsync(data.type, data);
  }
}

import Id from '@module-resource/domain/aggregate/value-objects/id.vo';
import Name from '@module-resource/domain/aggregate/value-objects/name.vo';
import Description from '@module-resource/domain/aggregate/value-objects/description.vo';
import CreatedAt from '@module-resource/domain/aggregate/value-objects/created-at.vo';
import DeletedAt from '@module-resource/domain/aggregate/value-objects/deleted-at.vo';
import UpdatedAt from '@module-resource/domain/aggregate/value-objects/updated-at.vo';
import IsEnabled from '@module-resource/domain/aggregate/value-objects/is-enabled.vo';
import Endpoint from '@module-resource/domain/aggregate/value-objects/endpoint.vo';
import Method from '@module-resource/domain/aggregate/value-objects/method.vo';
import { IResourceSchema } from '@module-resource/domain/aggregate/resource.schema';
import { IActionSchemaAggregate } from '@module-resource/domain/aggregate/resource.aggregate';
import { Action } from '@module-action/domain/aggregate/action';
import { ResourcePropertyWithSameValueException } from '@module-resource/domain/exceptions/resource-property-with-same-value.exception';
import { IActionSchema } from '@app-main/modules/action/domain/aggregate/action.schema';

export class Resource {
  private _entityRoot = {} as IActionSchemaAggregate;

  constructor(schema: IResourceSchema) {
    this.hydrate(schema);
  }

  public get id(): string {
    return this._entityRoot.id.value;
  }

  public get name(): string {
    return this._entityRoot.name.value;
  }

  public get description(): string {
    return this._entityRoot.description.value;
  }

  public get isEnabled(): boolean {
    return this._entityRoot.isEnabled.value;
  }

  public get endpoint(): string {
    return this._entityRoot.endpoint.value;
  }

  public get method(): string {
    return this._entityRoot.method.value;
  }

  public get triggers(): IResourceSchema[] | string[] | undefined {
    return this._entityRoot.triggers?.map((trigger) => {
      return trigger instanceof Resource ? trigger.toPrimitives() : trigger;
    });
  }

  public get triggersIds(): string[] {
    if (!this._entityRoot.triggers) return [];

    return this._entityRoot.triggers.map((trigger) => {
      return trigger instanceof Resource ? trigger.id : trigger;
    });
  }

  public get actions(): IActionSchema[] | string[] {
    return this._entityRoot.actions.map((action) => {
      return action instanceof Action ? action.toPrimitives() : action;
    });
  }

  public get actionsIds(): string[] {
    return this._entityRoot.actions.map((action) => {
      return action instanceof Action ? action.id : action;
    });
  }

  public get createdAt(): Date {
    return this._entityRoot.createdAt.value;
  }

  public get updatedAt(): Date {
    return this._entityRoot.updatedAt.value;
  }

  public get deletedAt(): Date | undefined {
    return this._entityRoot.deletedAt?.value;
  }

  public describe(name: string, description: string): void {
    this._entityRoot.name = new Name(name);
    this._entityRoot.description = new Description(description);
  }

  public enable(): void {
    if (this._entityRoot.isEnabled) {
      throw new ResourcePropertyWithSameValueException('isEnabled', true);
    }

    this._entityRoot.isEnabled = new IsEnabled(true);
  }

  public disable(): void {
    if (!this._entityRoot.isEnabled.value) {
      throw new ResourcePropertyWithSameValueException('isEnabled', false);
    }

    this._entityRoot.isEnabled = new IsEnabled(false);
    this._entityRoot.deletedAt = new DeletedAt(new Date());
  }

  public toPrimitives(): IResourceSchema {
    return {
      id: this._entityRoot.id.value,
      name: this._entityRoot.name.value,
      description: this._entityRoot.description.value,
      isEnabled: this._entityRoot.isEnabled.value,
      endpoint: this._entityRoot.endpoint.value,
      method: this._entityRoot.method.value,
      actions: this._entityRoot.actions,
      createdAt: this._entityRoot.createdAt.value,
      updatedAt: this._entityRoot.updatedAt.value,
      deletedAt: this._entityRoot.deletedAt?.value,
      triggers: this._entityRoot.triggers?.map((trigger) =>
        trigger instanceof Resource ? trigger.toPrimitives() : trigger,
      ),
    };
  }

  public hydrateTriggers(schema: IResourceSchema): void {
    if (schema.triggers) {
      const triggers = schema.triggers.map((trigger) => {
        return trigger instanceof Object ? new Resource(trigger) : (trigger as string);
      });

      if (!this._entityRoot.triggers) {
        this._entityRoot.triggers = [];
      }

      for (const trigger of triggers) {
        this._entityRoot.triggers.push(trigger);
      }
    }
  }

  public hydrateActions(schema: IResourceSchema): void {
    if (schema.actions) {
      const actions = schema.actions.map((action) => {
        return action instanceof Object ? new Action(action) : (action as string);
      });

      if (!this._entityRoot.actions) {
        this._entityRoot.actions = [];
      }

      for (const action of actions) {
        this._entityRoot.actions.push(action);
      }
    }
  }

  public hydrate(schema: IResourceSchema): void {
    this._entityRoot.id = new Id(schema.id);
    this._entityRoot.name = new Name(schema.name);
    this._entityRoot.description = new Description(schema.description);
    this._entityRoot.isEnabled = new IsEnabled(schema.isEnabled);
    this._entityRoot.endpoint = new Endpoint(schema.endpoint);
    this._entityRoot.method = new Method(schema.method);
    this._entityRoot.createdAt = new CreatedAt(schema.createdAt);
    this._entityRoot.updatedAt = new UpdatedAt(schema.updatedAt);

    if (schema.deletedAt) {
      this._entityRoot.deletedAt = new DeletedAt(schema.deletedAt);
    }

    this.hydrateTriggers(schema);
    this.hydrateActions(schema);
  }

  public useTriggers(resources: Resource[]): void {
    if (!this._entityRoot.triggers) {
      this._entityRoot.triggers = [];
      this._entityRoot.triggers.push(...resources);

      return;
    }

    for (const resource of resources) {
      const resourceIndex = this._entityRoot.triggers.findIndex((trigger) => {
        return trigger instanceof Resource ? trigger.id === resource.id : trigger === resource.id;
      });

      if (resourceIndex === -1) {
        this._entityRoot.triggers.push(resource);

        continue;
      }

      this._entityRoot.triggers.splice(resourceIndex, 1, resource);
    }
  }

  public useActions(actions: Action[]): void {
    if (this._entityRoot.actions.length === 0) {
      this._entityRoot.actions.push(...actions);

      return;
    }

    for (const action of actions) {
      const actionIndex = this._entityRoot.actions.findIndex((act) => {
        return act instanceof Action ? act.id === action.id : act === action.id;
      });

      if (actionIndex === -1) {
        this._entityRoot.actions.push(action);

        continue;
      }

      this._entityRoot.actions.splice(actionIndex, 1, action);
    }
  }
}

import Id from '@module-resource/domain/aggregate/value-objects/id.vo';
import Name from '@module-resource/domain/aggregate/value-objects/name.vo';
import Description from '@module-resource/domain/aggregate/value-objects/description.vo';
import CreatedAt from '@module-resource/domain/aggregate/value-objects/created-at.vo';
import DeletedAt from '@module-resource/domain/aggregate/value-objects/deleted-at.vo';
import UpdatedAt from '@module-resource/domain/aggregate/value-objects/updated-at.vo';
import IsEnabled from '@module-resource/domain/aggregate/value-objects/is-enabled.vo';
import Endpoint from '@module-resource/domain/aggregate/value-objects/endpoint.vo';
import Method, { EnumMethodValue } from '@module-resource/domain/aggregate/value-objects/method.vo';
import { IResourceSchema } from '@module-resource/domain/aggregate/resource.schema';
import { IActionSchemaAggregate } from '@module-resource/domain/aggregate/resource.aggregate';
import { Action } from '@module-action/domain/aggregate/action';
import { ResourcePropertyWithSameValueException } from '@module-resource/domain/exceptions/resource-property-with-same-value.exception';
import { IActionSchema } from '@app-main/modules/action/domain/aggregate/action.schema';
import { ResourceAlreadyEnabledException } from '@module-resource/domain/exceptions/resource-already-enabled.exception';

export class Resource {
  private _entityRoot = {} as IActionSchemaAggregate;

  constructor(schema?: IResourceSchema) {
    if (!schema) {
      this._entityRoot.isEnabled = new IsEnabled(true);
    }

    if (schema) this.hydrate(schema);
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

  public get method(): EnumMethodValue {
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

  public reDescribe(name?: string, description?: string): void {
    if (name) {
      if (this._entityRoot.name.value === name) {
        throw new ResourcePropertyWithSameValueException('name', name);
      }

      this._entityRoot.name = new Name(name);
    }

    if (description) {
      if (this._entityRoot.description.value === description) {
        throw new ResourcePropertyWithSameValueException('description', description);
      }

      this._entityRoot.description = new Description(description);
    }
  }

  public enable(): void {
    if (this._entityRoot.isEnabled.value === true) {
      throw new ResourceAlreadyEnabledException();
    }

    this._entityRoot.isEnabled = new IsEnabled(true);

    if (this._entityRoot.deletedAt) {
      this._entityRoot.deletedAt = undefined;
    }
  }

  public disable(): void {
    if (!this._entityRoot.isEnabled.value) {
      throw new ResourcePropertyWithSameValueException('isEnabled', false);
    }

    this._entityRoot.isEnabled = new IsEnabled(false);
    this._entityRoot.deletedAt = new DeletedAt(new Date());
  }

  public configNetwork(endpoint: string, method: EnumMethodValue): void {
    this._entityRoot.endpoint = new Endpoint(endpoint);
    this._entityRoot.method = new Method(method);
  }

  public reConfigNetwork(endpoint?: string, method?: EnumMethodValue): void {
    if (endpoint) {
      if (this._entityRoot.endpoint.value === endpoint) {
        throw new ResourcePropertyWithSameValueException('endpoint', endpoint);
      }

      this._entityRoot.endpoint = new Endpoint(endpoint);
    }

    if (method) {
      if (this._entityRoot.method.value === method) {
        throw new ResourcePropertyWithSameValueException('method', method);
      }

      this._entityRoot.method = new Method(method);
    }
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
      if (!this._entityRoot.triggers || this._entityRoot.triggers.length === 0) {
        this._entityRoot.triggers = [];
        this._entityRoot.triggers.push(...schema.triggers);

        return;
      }

      for (const trigger of schema.triggers) {
        const triggerIndex = this._entityRoot.triggers.findIndex((resource) => {
          if (resource instanceof Resource && trigger instanceof Resource) {
            return resource.id === trigger.id;
          } else if (resource instanceof Resource && typeof trigger === 'string') {
            return resource.id === trigger;
          } else if (typeof resource === 'string' && trigger instanceof Resource) {
            return resource === trigger.id;
          } else if (typeof resource === 'string' && typeof trigger === 'string') {
            return resource === trigger;
          }

          return false;
        });

        if (triggerIndex === -1) {
          this._entityRoot.triggers.push(trigger);
        }
      }
    }
  }

  public hydrateActions(schema: IResourceSchema): void {
    if (schema.actions) {
      if (!this._entityRoot.actions || this._entityRoot.actions.length === 0) {
        this._entityRoot.actions = [];
        this._entityRoot.actions.push(...schema.actions);

        return;
      }

      for (const action of schema.actions) {
        const actionIndex = this._entityRoot.actions.findIndex((act) => {
          if (act instanceof Action && action instanceof Action) {
            return act.id === action.id;
          } else if (act instanceof Action && typeof action === 'string') {
            return act.id === action;
          } else if (typeof act === 'string' && action instanceof Action) {
            return act === action.id;
          } else if (typeof act === 'string' && typeof action === 'string') {
            return act === action;
          }

          return false;
        });

        if (actionIndex === -1) {
          this._entityRoot.actions.push(action);
        }
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

  public useTriggersAndReturnLegacy(resources: Resource[]): {
    triggersToAdd: Resource[];
    triggersToRemove: Resource[];
  } {
    if (!this._entityRoot.triggers) {
      this._entityRoot.triggers = [];
      this._entityRoot.triggers.push(...resources);

      return {
        triggersToAdd: resources,
        triggersToRemove: [],
      };
    }

    const triggersToRemove = this._entityRoot.triggers.filter((trigger) => {
      return !resources.some((resource) => {
        return trigger instanceof Resource ? trigger.id === resource.id : trigger === resource.id;
      });
    });

    for (const triggerToRemove of triggersToRemove) {
      const triggerIndex = this._entityRoot.triggers.findIndex((trigger) => {
        if (trigger instanceof Resource && triggerToRemove instanceof Resource) {
          return trigger.id === triggerToRemove.id;
        } else if (trigger instanceof Resource && typeof triggerToRemove === 'string') {
          return trigger.id === triggerToRemove;
        } else if (typeof trigger === 'string' && triggerToRemove instanceof Resource) {
          return trigger === triggerToRemove.id;
        } else if (typeof trigger === 'string' && typeof triggerToRemove === 'string') {
          return trigger === triggerToRemove;
        } else {
          return false;
        }
      });

      if (triggerIndex === -1) continue;

      this._entityRoot.triggers.splice(triggerIndex, 1);
    }

    const triggersToAdd: Resource[] = [];

    for (const resource of resources) {
      const resourceIndex = this._entityRoot.triggers.findIndex((trigger) => {
        return trigger instanceof Resource ? trigger.id === resource.id : trigger === resource.id;
      });

      if (resourceIndex === -1) {
        this._entityRoot.triggers.push(resource);
        triggersToAdd.push(resource);

        continue;
      }

      this._entityRoot.triggers.splice(resourceIndex, 1, resource);
    }

    return {
      triggersToAdd,
      triggersToRemove,
    };
  }

  public useActions(actions: Action[]): void {
    if (!this._entityRoot.actions || this._entityRoot.actions.length === 0) {
      this._entityRoot.actions = [];
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

  public useActionAndReturnLegacy(actions: Action[]): { actionsToAdd: Action[]; actionsToRemove: Action[] } {
    if (!this._entityRoot.actions || this._entityRoot.actions.length === 0) {
      this._entityRoot.actions = [];
      this._entityRoot.actions.push(...actions);

      return {
        actionsToAdd: actions,
        actionsToRemove: [],
      };
    }

    const actionsToRemove = this._entityRoot.actions.filter((action) => {
      return !actions.some((act) => {
        return action instanceof Action ? action.id === act.id : action === act.id;
      });
    });

    for (const actionToRemove of actionsToRemove) {
      const actionIndex = this._entityRoot.actions.findIndex((action) => {
        if (action instanceof Action && actionToRemove instanceof Action) {
          return action.id === actionToRemove.id;
        } else if (action instanceof Action && typeof actionToRemove === 'string') {
          return action.id === actionToRemove;
        } else if (typeof action === 'string' && actionToRemove instanceof Action) {
          return action === actionToRemove.id;
        } else if (typeof action === 'string' && typeof actionToRemove === 'string') {
          return action === actionToRemove;
        } else {
          return false;
        }
      });

      if (actionIndex === -1) continue;

      this._entityRoot.actions.splice(actionIndex, 1);
    }

    const actionsToAdd: Action[] = [];

    for (const action of actions) {
      const actionIndex = this._entityRoot.actions.findIndex((act) => {
        return act instanceof Action ? act.id === action.id : act === action.id;
      });

      if (actionIndex === -1) {
        this._entityRoot.actions.push(action);
        actionsToAdd.push(action);

        continue;
      }

      this._entityRoot.actions.splice(actionIndex, 1, action);
    }

    return {
      actionsToAdd,
      actionsToRemove,
    };
  }

  public entityRootPartial(): Partial<IResourceSchema> {
    const partialSchema: Partial<IResourceSchema> = {};

    for (const [key, value] of Object.entries(this._entityRoot)) {
      if (value instanceof Object) {
        if (value.value !== null) {
          if (key === 'triggers') {
            partialSchema[key] = value.map((trigger) => trigger.id);
            continue;
          }

          if (key === 'actions') {
            partialSchema[key] = value.map((action) => action.id);
            continue;
          }

          partialSchema[key] = value.value;
        }
      } else {
        partialSchema[key] = value;
      }
    }

    return partialSchema;
  }

  public removeTriggers(): void {
    this._entityRoot.triggers = null;
  }
}

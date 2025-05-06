import { Resource } from '@module-resource/domain/aggregate/resource';
import { IResourceSchema } from '@module-resource/domain/aggregate/resource.schema';

export class ListResource {
  private resources: Resource[];
  private total: number;

  constructor(resourcesSchema: IResourceSchema[], total: number) {
    this.resources = resourcesSchema.map((resourceSchema) => new Resource(resourceSchema));
    this.setTotal(total);
  }

  public setTotal(total: number) {
    this.total = total;
  }

  public hydrate(resource: any[]): void {
    this.resources = [...resource];
    this.setTotal(resource.length);
  }

  public add(entity: Resource): void {
    this.resources.push(entity);
  }

  public entities(): Resource[] {
    return this.resources;
  }

  public get totalItems(): number {
    return this.total;
  }

  public get items(): Resource[] {
    return this.resources;
  }

  public set items(items: Resource[]) {
    this.resources = items;
  }
}

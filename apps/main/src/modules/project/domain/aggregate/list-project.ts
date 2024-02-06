import { Project, IProjectSchema } from '@app-main/modules/project/domain/aggregate/project';

export class ListProject {
  private projects: Project[];
  private total: number;

  constructor(projectsSchema: IProjectSchema[], total: number) {
    this.projects = projectsSchema.map((projectSchema) => new Project(projectSchema));
    this.setTotal(total);
  }

  private setTotal(total: number) {
    this.total = total;
  }

  public hydrate(project: any[]): void {
    this.projects = [...project];
    this.setTotal(project.length);
  }

  public add(entity: Project): void {
    this.projects.push(entity);
  }

  public entities(): Project[] {
    return this.projects;
  }

  public get totalItems(): number {
    return this.total;
  }

  public get items(): Project[] {
    return this.projects;
  }
}

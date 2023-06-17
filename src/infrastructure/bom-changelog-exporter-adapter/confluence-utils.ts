import { RepoStatus } from '../../domain/bom-diff/model/bom';

export class ConfluenceUtils {
  private static colorText(
    content: string,
    color: ConfluenceTextColor,
  ): string {
    return `<span style="color:${color};font-weight:bold">${content}</span>`;
  }

  public static colorWithRepoStatus(
    content: string,
    repoStatus?: RepoStatus,
  ): string {
    switch (repoStatus) {
      case RepoStatus.CREATED:
        return ConfluenceUtils.green(content);
      case RepoStatus.UPDATED:
        return ConfluenceUtils.blue(content);
      case RepoStatus.UNCHANGED:
        return ConfluenceUtils.black(content);
      default:
        return ConfluenceUtils.black(content);
    }
  }

  private static black(content: string): string {
    return ConfluenceUtils.colorText(content, ConfluenceTextColor.BLACK);
  }

  private static green(content: string): string {
    return ConfluenceUtils.colorText(content, ConfluenceTextColor.GREEN);
  }

  private static blue(content: string): string {
    return ConfluenceUtils.colorText(content, ConfluenceTextColor.BLUE);
  }
}

enum ConfluenceTextColor {
  BLACK = 'black',
  GREEN = 'green',
  BLUE = 'blue',
}

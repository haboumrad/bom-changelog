export class ConfluenceContentBuilder {
  private content: string[] = [];

  build(): string {
    const result = this.content.join('');
    this.content.length = 0;
    return result;
  }

  appendHeading(headingName: string): ConfluenceContentBuilder {
    this.content.push(`<h1>${headingName}</h1>`);
    return this;
  }

  appendParagraph(paragraph: string): ConfluenceContentBuilder {
    this.content.push(`<p>${paragraph}</p>`);
    return this;
  }

  appendTableStart(tableHeaders: string[]): ConfluenceContentBuilder {
    this.content.push('<table>');
    this.content.push('<tbody>');
    this.content.push('<tr>');
    tableHeaders.forEach((header) => this.content.push(`<th>${header}</th>`));
    this.content.push('</tr>');
    return this;
  }

  appendTableEnd(): ConfluenceContentBuilder {
    this.content.push('</tbody>');
    this.content.push('</table>');
    return this;
  }

  appendTableLineStart(): ConfluenceContentBuilder {
    this.content.push('<tr>');
    return this;
  }

  appendTableLineEnd(): ConfluenceContentBuilder {
    this.content.push('</tr>');
    return this;
  }

  appendTableLineColumnStart(): ConfluenceContentBuilder {
    this.content.push('<td>');
    return this;
  }

  appendTableLineColumnEnd(): ConfluenceContentBuilder {
    this.content.push('</td>');
    return this;
  }

  appendLinkExternalUrl(
    linkName: string,
    linkUrl: string,
  ): ConfluenceContentBuilder {
    this.content.push(`<a href="${linkUrl}">${linkName}</a>`);
    return this;
  }

  appendCDATA(content: string): ConfluenceContentBuilder {
    this.content.push(`<![CDATA[${content}]]>`);
    return this;
  }

  appendConfluenceLink(
    linkName: string,
    confluencePageName: string,
  ): ConfluenceContentBuilder {
    this.content.push(
      `<ac:link><ri:page ri:content-title="${confluencePageName}"/><ac:plain-text-link-body><![CDATA[${linkName}]]></ac:plain-text-link-body></ac:link>`,
    );
    return this;
  }
}

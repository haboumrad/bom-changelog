import { Injectable } from '@nestjs/common';
import { ChangeExtractor } from '../../domain/change-management/port/change-extractor';
import { Change } from '../../domain/change-management/model/Changelog';
import axios from 'axios';
import {
  JiraChangeExtractorConfiguration,
  JiraChangeExtractorConfigurationService,
} from './configuration/jira-change-extractor-configuration.service';
import * as process from 'node:process';

@Injectable()
export class JiraChangeExtractor implements ChangeExtractor {
  private readonly configuration: JiraChangeExtractorConfiguration;
  constructor(
    private readonly configurationService: JiraChangeExtractorConfigurationService,
  ) {
    this.configuration = this.configurationService.getConfig();
  }

  async getChange(id: string): Promise<Change> {
    const basicAuth = Buffer.from(
      `${this.configuration.jiraUser}:${this.configuration.jiraToken}`,
    ).toString('base64');
    return axios
      .get(`${this.configuration.jiraUrl}/rest/api/2/issue/${id}`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Basic ${basicAuth}`,
        },
      })
      .then((response) => {
        if (response.status == 200) {
          return response.data as JiraChange;
        }
        throw new Error(`Error while getting issue. ${response}`);
      })
      .then((change) => this.toChange(change));
  }

  private toChange(jiraChange: JiraChange): Change {
    const assignee = jiraChange.fields.assignee?.emailAddress;
    return {
      id: jiraChange.key,
      url: `${this.configuration.jiraUrl}/browse/${jiraChange.key}`,
      summary: jiraChange.fields.summary,
      type: jiraChange.fields.issuetype.name,
      status: jiraChange.fields.status.name,
      deploymentImpact: this.configuration.jiraDeploymentImpactField
        ? jiraChange.fields[this.configuration.jiraDeploymentImpactField]
        : undefined,
      assignee: assignee ? assignee : undefined,
    };
  }
}

type JiraChange = {
  key: string;
  self: string;
  fields: {
    issuetype: {
      name: string;
    };
    status: {
      name: string;
    };
    assignee?: {
      emailAddress?: string;
    };
    summary: string;
  };
};

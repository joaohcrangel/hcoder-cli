import { Injectable, OnModuleInit } from '@nestjs/common';
import OpenAI from 'openai';
import { ConfigurationService } from '../configuration/configuration.service';
import { ConfigEnum } from '../../enums/config.enum';
import * as ora from 'ora';
import { readFile } from 'fs/promises';
import { join } from 'path';

@Injectable()
export class OpenaiService implements OnModuleInit {
  private client: OpenAI;

  constructor(private readonly config: ConfigurationService) {}

  async onModuleInit() {
    const apiKey = await this.config.get(ConfigEnum.TOKEN);

    if (apiKey) {
      this.client = new OpenAI({
        apiKey,
      });
    } else {
      ora().fail(
        'Configure o token da API do OpenAI usando o comando `hcoder configure`',
      );
    }

    await this.getAssistantId();
  }

  private validateClient() {
    if (!this.client) {
      ora().fail('Cliente OpenAI não inicializado. Verifique o token.');
      return;
    }
  }

  async createAssistant(prompt: string, model = 'gpt-4o') {
    await this.validateClient();

    try {
      const { id } = await this.client.beta.assistants.create({
        name: 'hcoder-assistant-command',
        description: 'Assistente de linha de comando para o hcoder',
        instructions: prompt,
        model,
      });

      return id;
    } catch (error) {
      ora().fail(`Error: ${error.message}`);
    }
  }

  async getAssistantId() {
    await this.validateClient();

    let assistantId = await this.config.get(ConfigEnum.ASSISTANT_ID);

    if (!assistantId) {
      console.log('Template PATH', join(__dirname, 'openia.assistant.md'));

      const prompt = await readFile(
        join(__dirname, 'openia.assistant.md'),
        'utf-8',
      );
      assistantId = await this.createAssistant(prompt);
      await this.config.setConfig(ConfigEnum.ASSISTANT_ID, assistantId);
    }

    return assistantId;
  }

  async sendThread(messages: OpenAI.Beta.Threads.ThreadCreateParams.Message[]) {
    const assistantId = await this.getAssistantId();

    if (!assistantId) {
      ora().fail('Assistente não encontrado. Verifique o ID do assistente.');
      return;
    }

    try {
      const thread = await this.client.beta.threads.create({
        messages,
      });

      await this.client.beta.threads.runs.createAndPoll(thread.id, {
        assistant_id: assistantId,
      });

      const fetchMessages = await this.client.beta.threads.messages.list(
        thread.id,
        {
          limit: 1,
          order: 'desc',
        },
      );

      const contentResult = fetchMessages.data.pop()?.content ?? '';

      if (!contentResult) {
        ora().fail('Nenhuma mensagem encontrada no assistente.');
        return;
      }

      const result = contentResult
        .map((item: any) => item?.text?.value ?? '')
        .join('');

      return result;
    } catch (error) {
      ora().fail(`Erro ao se comunicar com o assistente: ${error.message}`);
    }
  }
}

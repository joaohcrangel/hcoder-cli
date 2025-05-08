import { readFile } from 'fs/promises';
import { runCLI } from './utils/run-cli';
import { join } from 'path';
import { homedir } from 'os';

describe('Hcoder CLI (e2e)', () => {
  it('should run the CLI without errors', async () => {
    const { code, output } = await runCLI([]);

    expect(code).toBe(1);
    expect(output).toContain('Usage:');
  });

  it('should run configure command', async () => {
    const fakeToken = 'test-token';

    const { code, output } = await runCLI(['configure', '--token', fakeToken]);

    expect(code).toBe(0);
    expect(output).toContain('Configuração salva com sucesso!');

    const configFile = JSON.parse(
      await readFile(join(homedir(), '.hcoder', 'config.json'), 'utf-8'),
    );

    expect(configFile.token).toEqual(fakeToken);
  });
});

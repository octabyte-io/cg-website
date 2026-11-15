// The console tour: real console screenshots (fictional "Northwind Labs" data, the same captures the
// docs use) shown on the home page and on /tour. The files are copies of public/docs/screens in
// src/assets/console, so astro:assets can make responsive AVIF and WebP from them; the docs keep
// their originals.
import type { ImageMetadata } from 'astro';
import overviewDark from '../assets/console/application-overview-dark.webp';
import overviewLight from '../assets/console/application-overview-light.webp';
import logDark from '../assets/console/deployment-log-dark.webp';
import logLight from '../assets/console/deployment-log-light.webp';
import planDark from '../assets/console/plan-card-dark.webp';
import planLight from '../assets/console/plan-card-light.webp';
import healthDark from '../assets/console/service-health-dark.webp';
import healthLight from '../assets/console/service-health-light.webp';
import telemetryDark from '../assets/console/server-telemetry-dark.webp';
import telemetryLight from '../assets/console/server-telemetry-light.webp';
import agentDark from '../assets/console/agent-connect-dark.webp';
import agentLight from '../assets/console/agent-connect-light.webp';
import buyDark from '../assets/console/servers-buy-dark.webp';
import buyLight from '../assets/console/servers-buy-light.webp';
import modelDark from '../assets/console/ai-model-model-tab-dark.webp';
import modelLight from '../assets/console/ai-model-model-tab-light.webp';

export interface TourStop {
  id: string;
  /** The tab's name on the home page. */
  label: string;
  /** The question a section of /tour answers. */
  question: string;
  /** One or two sentences under the screenshot, in the console's own words. */
  caption: string;
  /** What the screenshot shows, for people who cannot see it. */
  alt: string;
  /** The address in the window's bar. */
  route: string;
  docs: { href: string; label: string };
  dark: ImageMetadata;
  light: ImageMetadata;
  /** Shown in the home page's tour, not only on /tour. */
  home: boolean;
}

const host = 'cloudgate.octabyte.app';

export const tour: TourStop[] = [
  {
    id: 'deploy',
    label: 'Deploy',
    question: 'What happens when I press Deploy?',
    caption:
      'Press Deploy on an Application and its build output streams as the build writes it, beside its source, its health and the Server it runs on.',
    alt: 'The Overview of the web Application in the storefront Project: a Next.js build streaming in the Build output card, the GitHub source northwind-labs/storefront on main, and fra-1 as its Server.',
    route: `${host}/applications/…`,
    docs: { href: '/docs/guide/applications', label: 'Applications in the user guide' },
    dark: overviewDark,
    light: overviewLight,
    home: true,
  },
  {
    id: 'logs',
    label: 'Logs',
    question: 'Can I read every Deployment’s build log?',
    caption:
      'Every Deployment keeps its times, its commit and its whole log, from the Nixpacks build to the rolling update that ends in Docker Deployed.',
    alt: 'A finished Deployment of web for the commit “Cache product listing for 60s”: queued, started and finished times, the log file path, and the build log ending in Nixpacks build completed and Docker Deployed.',
    route: `${host}/applications/…/deployments`,
    docs: { href: '/docs/guide/deployments', label: 'Deployments and build logs' },
    dark: logDark,
    light: logLight,
    home: true,
  },
  {
    id: 'plan',
    label: 'Plan and Apply',
    question: 'How do I review a change before it runs?',
    caption:
      'Edit the Project config and each Environment gets a Plan: what it creates, changes and destroys, line by line, until you press Apply.',
    alt: 'The storefront Project config as YAML, and the open Plan for production below it: create a Redis queue, change the emails worker’s description and add QUEUE_URL from queue.url, with Dismiss and Apply.',
    route: `${host}/projects/…/config`,
    docs: { href: '/docs/guide/project-config', label: 'Project config and Plans' },
    dark: planDark,
    light: planLight,
    home: true,
  },
  {
    id: 'health',
    label: 'Health',
    question: 'How do I know my app is up?',
    caption:
      'An Uptime check probes the Service’s own Domains. A run of downs opens an Incident and the first up closes it; an error-rate threshold can open one too.',
    alt: 'The Health tab of the web Application: an HTTPS Uptime check of shop.northwind.example that is up, its last 24 hours as a row of bars with one down, and the Error rate and Error-rate threshold cards.',
    route: `${host}/applications/…/health`,
    docs: { href: '/docs/guide/monitoring', label: 'Monitoring, uptime and incidents' },
    dark: healthDark,
    light: healthLight,
    home: true,
  },
  {
    id: 'agents',
    label: 'Agents',
    question: 'How do I connect my AI agent?',
    caption:
      'An Agent’s Connect panel gives the MCP endpoint and the config to paste into Claude Code, VS Code, Cursor, Codex CLI or any other client. The key itself is never in it.',
    alt: 'The Connect panel for the Agent deploy-bot: tabs for Claude Code, VS Code, Cursor, Codex CLI and any other client, and an .mcp.json that points at the console’s /mcp endpoint with the key read from CLOUDGATE_AGENT_KEY.',
    route: `${host}/settings/agents`,
    docs: { href: '/docs/guide/agents', label: 'Agents and agent keys' },
    dark: agentDark,
    light: agentLight,
    home: true,
  },
  {
    id: 'servers',
    label: 'Buy a Server',
    question: 'Can I get a server without leaving the console?',
    caption:
      'On the Hosted instance, pick a location on the map and a size, add backups or extra storage, and Cloudgate sets the Server up for you.',
    alt: 'The Buy a Server page: a world map with locations in Europe, the United States and Singapore, the closest location marked, and the Size and Extras steps below, with a Summary beside them.',
    route: `${host}/servers/buy`,
    docs: { href: '/docs/guide/bought-servers', label: 'Bought Servers' },
    dark: buyDark,
    light: buyLight,
    home: true,
  },
  {
    id: 'telemetry',
    label: 'Telemetry',
    question: 'Can I see how busy a Server is?',
    caption:
      'Cloudgate reads each Server’s CPU, memory, disk and network over the same SSH connection it uses for everything else. There is no agent to install on the machine.',
    alt: 'The Telemetry tab of the fra-1 Server: a CPU chart over the last 50 samples, CPU, memory and disk utilisation bars, uptime, cores and network totals, and the sampling settings (every 60 seconds, kept 7 days).',
    route: `${host}/servers/…/telemetry`,
    docs: { href: '/docs/guide/servers', label: 'Servers and telemetry' },
    dark: telemetryDark,
    light: telemetryLight,
    home: true,
  },
  {
    id: 'ai-model',
    label: 'AI model',
    question: 'What does an AI model look like in the console?',
    caption:
      'An AI model’s Model tab names its inference runtime and model, the GPUs it reserves, and the endpoint any OpenAI-compatible client calls with an Agent key.',
    alt: 'The Model tab of the llama AI model: Ollama serving llama3.1:8b on image 0.12.6, no GPUs reserved, and the Connect a client card with the endpoint and an OpenAI SDK snippet.',
    route: `${host}/applications/…/model`,
    docs: { href: '/docs/guide/ai-models', label: 'AI models and the Gateway' },
    dark: modelDark,
    light: modelLight,
    home: false,
  },
];

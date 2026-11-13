# Builds cg-website/src/data/openapi.json: the public, filtered Cloudgate OpenAPI document, enriched
# with a summary, a plain description and the permission each operation needs (read from the
# controllers by extract.cjs). Run: node extract.cjs extract.cjson && python3 build.py
import json, re, copy, sys, os
sys.path.insert(0, '.')
from clean import clean

HERE = os.path.dirname(os.path.abspath(__file__))
CLOUDGATE = os.environ.get('CLOUDGATE_DIR', os.path.join(HERE, '../../../cloudgate'))
SRC = os.path.join(CLOUDGATE, 'backend/openapi.json')
OUT = os.path.join(HERE, '../../src/data/openapi.json')
d = json.load(open(SRC))
ex = json.load(open('extract.cjson'))

EXCLUDED_TAGS = {'Operator', 'OperatorAbuse', 'Admin', 'BillingWebhook', 'App'}
def excluded(method, path, op):
    if set(op.get('tags', [])) & EXCLUDED_TAGS: return True
    if path in ('/github/webhook', '/notifications/receive'): return True
    if path.startswith('/git-providers/oauth/') and (path.endswith('/callback') or path.endswith('/setup')): return True
    return False

NOUN = {
 'Projects': ('Project', 'Projects'), 'Environments': ('Environment', 'Environments'), 'Applications': ('Application', 'Applications'),
 'Compose': ('Compose stack', 'Compose stacks'), 'Deployments': ('Deployment', 'Deployments'), 'PreviewDeployments': ('preview deployment', 'preview deployments'),
 'Rollbacks': ('rollback snapshot', 'rollback snapshots'), 'Postgres': ('PostgreSQL database', 'PostgreSQL databases'), 'Mysql': ('MySQL database', 'MySQL databases'),
 'Mariadb': ('MariaDB database', 'MariaDB databases'), 'Mongo': ('MongoDB database', 'MongoDB databases'), 'Redis': ('Redis database', 'Redis databases'),
 'Libsql': ('libSQL database', 'libSQL databases'), 'Buckets': ('bucket', 'buckets'), 'Backups': ('backup', 'backups'), 'VolumeBackups': ('volume backup', 'volume backups'),
 'Destinations': ('backup destination', 'backup destinations'), 'Servers': ('Server', 'Servers'), 'SshKeys': ('SSH key', 'SSH keys'), 'Registries': ('registry', 'registries'),
 'CloudAccounts': ('Cloud account', 'Cloud accounts'), 'Domains': ('Domain', 'Domains'), 'Certificates': ('certificate', 'certificates'), 'Redirects': ('redirect', 'redirects'),
 'Ports': ('port', 'ports'), 'Mounts': ('mount', 'mounts'), 'Security': ('basic-auth user', 'basic-auth users'), 'Schedules': ('schedule', 'schedules'),
 'Notifications': ('notification channel', 'notification channels'), 'UptimeChecks': ('uptime check', 'uptime checks'), 'ErrorRateThresholds': ('error-rate threshold', 'error-rate thresholds'),
 'Agents': ('Agent', 'Agents'), 'Ai': ('AI provider', 'AI providers'), 'Tags': ('tag', 'tags'), 'CustomRole': ('custom role', 'custom roles'),
 'GitProviders': ('git provider', 'git providers'), 'Github': ('GitHub connection', 'GitHub connections'), 'Gitlab': ('GitLab connection', 'GitLab connections'),
 'Gitea': ('Gitea connection', 'Gitea connections'), 'Bitbucket': ('Bitbucket connection', 'Bitbucket connections'), 'Sso': ('SSO provider', 'SSO providers'),
 'Scim': ('SCIM provider', 'SCIM providers'), 'Templates': ('Template', 'Templates'), 'Patch': ('patch', 'patches'), 'BoughtServers': ('Bought Server', 'Bought Servers'),
 'Organizations': ('Organization', 'Organizations'), 'Plans': ('Plan', 'Plans'), 'PendingSetups': ('pending setup', 'pending setups'), 'ProjectConfigs': ('Project config', 'Project configs'),
 'Users': ('user', 'users'), 'ServiceCloudResources': ('cloud resource', 'cloud resources'), 'NetworkCloudResources': ('network cloud resource', 'network cloud resources'),
 'WiredVariables': ('wired variable', 'wired variables'),
}
ACRONYM = {'ip': 'IP', 'gpu': 'GPU', 'ssh': 'SSH', 'sso': 'SSO', 'scim': 'SCIM', 'dns': 'DNS', 'api': 'API', 'url': 'URL', 'rds': 'RDS', 'vm': 'VM', 'ttl': 'TTL', 'ai': 'AI', 'id': 'ID',
           'v1': 'v1', 'github': 'GitHub', 'gitlab': 'GitLab', 'gitea': 'Gitea', 'traefik': 'Traefik', 'docker': 'Docker', 'swarm': 'Swarm', 'slack': 'Slack', 'telegram': 'Telegram',
           'discord': 'Discord', 'resend': 'Resend', 'gotify': 'Gotify', 'ntfy': 'ntfy', 'mattermost': 'Mattermost', 'lark': 'Lark', 'pushover': 'Pushover', 'teams': 'Teams',
           'elasti': 'Elasti', 'elasticache': 'ElastiCache', 'memorystore': 'Memorystore', 'stripe': 'Stripe', 'whitelabeling': 'white-labeling', 'cdn': 'CDN', 'acme': 'ACME'}
OVERRIDE = {
 'UsersController_getProfile': 'Get your profile', 'UsersController_updateProfile': 'Update your profile', 'UsersController_whoami': 'Show who a key belongs to',
 'UsersController_createApiKey': 'Create a Personal key', 'UsersController_listApiKeys': 'List your Personal keys', 'UsersController_deleteApiKey': 'Delete a Personal key',
 'UsersController_listSessions': 'List your sessions', 'UsersController_revokeSession': 'Revoke a session',
 'UsersController_enableTwoFactor': 'Turn on two-factor sign-in', 'UsersController_verifyTwoFactor': 'Verify a two-factor code', 'UsersController_disableTwoFactor': 'Turn off two-factor sign-in',
 'DeviceLoginController_create': 'Start a device login', 'DeviceLoginController_poll': 'Poll a device login for its key',
 'SignUpController_signUpOpen': 'Check whether sign-up is open', 'SignUpController_passwordResetOpen': 'Check whether password reset works', 'SignUpController_invitationPreview': 'Preview an invitation',
 'DeploymentsController_deploy': 'Deploy an Application', 'DeploymentsController_deployCompose': 'Deploy a Compose stack', 'DeploymentsController_redeploy': 'Redeploy an Application',
 'DeploymentsController_list': "List the Organization's Deployments", 'DeploymentsController_readLogs': 'Read a Deployment log', 'AboutController_about': 'Identify the instance',
 'SettingsController_health': 'Check liveness', 'AuditLogController_list': 'List audit log entries', 'ProjectConfigSchemaController_findV1': 'Get the Project config schema',
 'RollbacksController_rollback': 'Roll back to a snapshot', 'TokenSpendController_forAiModel': 'Read token spend for an AI model',
 'ProjectTokenSpendController_forProject': 'Read token spend for a Project', 'EnvironmentTokenSpendController_forEnvironment': 'Read token spend for an Environment',
 'RuntimeLogController_read': 'Read the runtime log', 'CronRunsController_list': 'List cron runs', 'ServiceHealthController_listHealth': 'List Service health',
 'CdnController_validateDomain': 'Check a Domain behind a CDN', 'OrganizationsController_creation': 'Check whether you can create an Organization',
 'OrganizationsController_active': 'Get the active Organization', 'OrganizationsController_setDefault': 'Set your default Organization',
 'AuditLogController_findAll': 'List audit log entries', 'DeviceLoginController_start': 'Start a device login',
 'ProjectConfigsController_create': 'Make Plans from a Project config', 'ProjectConfigsController_preview': 'Preview moving a Project config', 'ProjectConfigsController_move': 'Move a Project config',
 'PlansController_findCopy': "Get an Environment's config copy", 'PlansController_repositorySources': 'List repository-sourced Services', 'PlansController_findOne': "Get an Environment's Plan",
 'PlansController_create': 'Check for changes (make a Plan)', 'PlansController_dismiss': 'Dismiss the open Plan', 'PlansController_apply': 'Apply the open Plan',
 'WiredVariablesController_findOne': "Get a Service's wired variables", 'WiredVariablesController_update': "Set a Service's wired variables",
 'ApplicationsController_uploadDrop': 'Upload files for a drop deployment', 'ApplicationsController_compareDrop': 'Compare a folder with the uploaded files',
 'ApplicationsController_applyDrop': 'Upload only the changed files', 'PlansController_configSources': "List where each config entry's code comes from",
 'ServersController_startMaintenance': 'Start maintenance on a Server', 'ServersController_endMaintenance': 'End maintenance on a Server', 'ApplicationsController_setCopyRange': 'Set the copy range', 'ApplicationsController_refreshToken': 'Rotate the deploy-webhook token',
 'ApplicationsController_gpuWait': 'Check whether it waits for a GPU', 'ApplicationsController_listVariables': 'List runtime variable names', 'ApplicationsController_updateVariables': 'Set or unset runtime variables',
 'ApplicationsController_testRegistryLogin': 'Test a registry login', 'CloudAccountsController_setup': 'Get Cloud account setup', 'CloudAccountsController_template': 'Get the setup template',
 'CloudAccountsController_check': 'Check a Cloud account now', 'CloudAccountsController_newKey': 'Make a new key (Google Cloud)', 'CloudAccountsController_checkNewKey': 'Check the new key',
 'ServiceHealthController_findOne': "Get a Service's health", 'EnvironmentsController_listHealth': 'List health in an Environment', 'EnvironmentsController_listDeployments': 'List Deployments in an Environment',
 'EnvironmentsController_listNetworks': 'List networks in an Environment', 'EnvironmentsController_listDomains': 'List Domains in an Environment',
 'BoughtServersController_offer': 'Check whether buying a Server is offered', 'BoughtServersController_catalogue': 'List locations, sizes and prices', 'BoughtServersController_today': 'Price a purchase today',
 'BoughtServersController_sizes': 'List sizes a Server can move to', 'BoughtServersController_create': 'Buy a Server', 'BoughtServersController_cancel': 'Cancel an unpaid purchase', 'BoughtServersController_finishPaying': 'Finish paying for a purchase',
 'TracesController_findOne': 'Get trace settings', 'TracesController_update': 'Update trace settings', 'TracesController_frame': 'Get a trace viewer frame',
 'CronRunsController_run': 'Run a cron Service now', 'TemplatesController_tags': 'List Template tags', 'TemplatesController_findOne': 'Get a Template setup form', 'TemplatesController_create': 'Set up a Template',
 'AiController_getEnabledProviders': 'List enabled AI providers', 'AiController_getModels': "List a provider's models", 'AiController_suggest': 'Suggest a Compose stack with AI',
 'AiController_analyzeLogs': 'Analyze logs with AI', 'AiController_deploy': 'Deploy an AI-suggested Compose stack', 'CustomRoleController_getStatements': 'List permission statements',
 'CustomRoleController_membersByRole': 'List members holding a role', 'SsoController_showSignIn': 'Check whether SSO sign-in shows', 'SsoController_enforce': 'Get SSO enforcement', 'SsoController_setEnforce': 'Set SSO enforcement',
 'SsoController_redirectUri': 'Get the OIDC redirect URI', 'SsoController_listProviders': 'List SSO providers', 'ScimController_listProviders': 'List SCIM providers', 'ScimController_generateToken': 'Generate a SCIM token',
 'ScimController_deleteProvider': 'Delete a SCIM provider', 'ForwardAuthController_listProviders': 'List forward-auth providers', 'OrganizationsController_invite': 'Invite a member',
 'OrganizationsController_listTeams': 'List teams', 'DomainsController_byApplicationId': "List an Application's Domains", 'DomainsController_byComposeId': "List a Compose stack's Domains",
 'DomainsController_byBucketId': "List a bucket's Domains", 'DomainsController_askAgain': 'Request a certificate again', 'DomainsController_generate': 'Generate a free sslip.io Domain',
 'PatchController_byEntityId': "List a Service's patches", 'UptimeChecksController_publishedPorts': 'List ports a check may dial', 'DeploymentsController_stopRun': 'Stop a Cloud run',
 'DeploymentsController_buildNow': 'Build a held push now', 'PreviewDeploymentsController_createRequested': 'Request a preview', 'NotificationsController_testSaved': 'Test a saved channel',
 'LicenseController_status': 'Get licence status', 'LicenseController_activate': 'Activate a licence', 'LicenseController_validate': 'Validate a licence key', 'LicenseController_checkNow': 'Check the licence now',
 'LicenseController_deactivate': 'Deactivate the licence', 'BucketsController_updateOrigins': 'Set upload origins', 'BucketsController_rotateKey': "Rotate a bucket's key",
 'ServersController_forgetHostKey': 'Forget the host key', 'ServersController_setup': 'Set up a Server', 'ServersController_audit': 'Audit a Server', 'ServersController_validate': 'Validate a Server',
 'AgentsController_addKey': 'Add an Agent key', 'AgentsController_removeKey': 'Remove an Agent key', 'SettingsController_isUserSubscribed': 'Check whether the Organization has Servers or Projects',
 'SettingsController_haveActivateRequests': 'Check whether the access log is on', 'SettingsController_toggleRequests': 'Turn the access log on or off', 'SettingsController_gpuCounts': 'Count GPUs',
 'SettingsController_getUpdateData': 'Check for a newer version', 'SettingsController_updateServer': 'Update Cloudgate', 'SettingsController_assignDomain': "Set the console's domain",
 'SettingsController_haveTraefikDashboardPortEnabled': 'Check the Traefik dashboard port', 'SettingsController_toggleDashboard': 'Turn the Traefik dashboard on or off',
 'SettingsController_cleanAllDeploymentQueue': 'Clear the deployment queue', 'SettingsController_cleanDockerPrune': 'Prune Docker system', 'SettingsController_cleanAll': 'Run every cleanup',
 'SettingsController_cleanMonitoring': 'Clear stored metrics', 'SettingsController_setupGpu': 'Set up GPU support', 'SettingsController_getIp': 'Get the server IP',
}
def words(name):
    w = re.sub(r'([a-z0-9])([A-Z])', r'\1 \2', name).split()
    return [ACRONYM.get(x.lower(), x.lower()) for x in w]
def summary(op_id, tag, method, path):
    if op_id in OVERRIDE: return OVERRIDE[op_id]
    fn = op_id.split('_', 1)[1]
    m = re.fullmatch(r'(create|update|test)(Slack|Telegram|Discord|Email|Resend|Gotify|Ntfy|Mattermost|Custom|Lark|Pushover|Teams)', fn)
    if tag == 'Notifications' and m:
        kind = {'Email': 'email', 'Custom': 'custom webhook', 'Ntfy': 'ntfy', 'Teams': 'Microsoft Teams'}.get(m.group(2), m.group(2))
        verb = {'create': 'Add', 'update': 'Update', 'test': 'Send a test to'}[m.group(1)]
        art = 'an' if kind[0] in 'aeiou' else 'a'
        return f'{verb} {art} {kind} channel' if m.group(1) != 'test' else f'Test {art} {kind} channel before saving'
    one, many = NOUN.get(tag, (None, None))
    if one is None:
        w = words(fn); w[0] = w[0][:1].upper() + w[0][1:]; return ' '.join(w)
    art = 'an' if one[0].lower() in 'aeiou' or one.startswith(('SSH', 'SSO')) else 'a'
    base = {'findOne': f'Get {art} {one}', 'getById': f'Get {art} {one}', 'list': f'List {many}', 'findAll': f'List {many}', 'create': f'Create {art} {one}',
            'update': f'Update {art} {one}', 'remove': f'Delete {art} {one}', 'delete': f'Delete {art} {one}'}
    if fn in base: return base[fn]
    m = re.match(r'(findAll|list)By(\w+)', fn)
    if m:
        target = ' '.join(words(m.group(2)))
        target = {'application': 'an Application', 'compose': 'a Compose stack', 'schedule': 'a schedule', 'volume backup': 'a volume backup', 'service': 'a Service', 'project': 'a Project'}.get(target, 'a ' + target)
        return f'List {many} for {target}'
    w = words(fn)
    if fn.startswith('get'): w[0] = 'get'
    phrase = ' '.join(w)
    phrase = phrase[:1].upper() + phrase[1:]
    if len(w) == 1 or fn in ('changeStatus', 'retryDelete', 'forgetDelete', 'cancelSwitch', 'saveEnvironment', 'createExisting', 'updateExisting', 'dataVolume', 'finalSnapshot', 'cloudBackups', 'existingReach', 'saveExternalPort', 'saveExternalPorts', 'switchToExisting', 'switchToMade', 'saveRdsSettings', 'saveCloudSqlSettings', 'saveElastiCacheSettings', 'saveMemorystoreSettings', 'testConnection', 'testSavedConnection', 'runManual', 'removeContainers', 'stackVmStatus', 'saveStackVm', 'loadServices', 'getConverted', 'listRepositories', 'listBranches'):
        tail = {'changeStatus': 'Change status of', 'retryDelete': 'Retry deleting', 'forgetDelete': 'Forget the incomplete delete of', 'cancelSwitch': 'Cancel the switch of',
                'saveEnvironment': 'Save the environment variables of', 'createExisting': 'Use an existing', 'updateExisting': 'Update an existing', 'dataVolume': 'Check the data volume of',
                'finalSnapshot': 'Preview the final snapshot of', 'cloudBackups': 'List cloud backups of', 'existingReach': 'Read reach for an existing', 'saveExternalPort': 'Set the external port of',
                'saveExternalPorts': 'Set the external ports of', 'switchToExisting': 'Switch to an existing', 'switchToMade': 'Switch to a Cloudgate-made',
                'saveRdsSettings': 'Save RDS settings of', 'saveCloudSqlSettings': 'Save Cloud SQL settings of', 'saveElastiCacheSettings': 'Save ElastiCache settings of',
                'saveMemorystoreSettings': 'Save Memorystore settings of', 'testConnection': 'Test a connection to', 'testSavedConnection': 'Test a saved', 'runManual': 'Run now:',
                'removeContainers': 'Remove the containers of', 'stackVmStatus': 'Get the Stack VM status of', 'saveStackVm': 'Save the Stack VM of', 'loadServices': 'Load the services of',
                'getConverted': 'Get the converted file of', 'listRepositories': 'List repositories of', 'listBranches': 'List branches of'}.get(fn)
        if tail:
            if tail.endswith((' existing', ' Cloudgate-made', ' saved')): return f'{tail} {one}'
            if tail.endswith(':'): return f'Run {art} {one} now'
            return f'{tail} {art} {one}'
        return f'{phrase} {art} {one}'
    return phrase

ROLE_TEXT = None
out_paths = {}
excluded_list = []
for path, ops in d['paths'].items():
    for method, op in ops.items():
        if method == 'parameters': continue
        if excluded(method, path, op):
            excluded_list.append((method.upper(), path, op['tags'][0])); continue
        o = copy.deepcopy(op)
        x = ex[o['operationId']]
        tag = o['tags'][0]
        o['summary'] = summary(o['operationId'], tag, method, path)
        desc = clean(x['doc']).replace('; instance authority only.', '; owners and admins of the instance organization only.').replace('; instance authority', '; owners and admins of the instance organization only').replace('instance authority', 'the instance organization’s owners and admins')
        if desc: o['description'] = desc
        if x['perm']:
            o['x-cloudgate-permission'] = [{'resource': p[0], 'actions': p[1:]} for p in x['perm']]
        if x['public']: o['security'] = []
        names = {(p['name'], p['in']) for p in o.get('parameters', [])}
        for q in x['queries']:
            if q['name'] and (q['name'], 'query') not in names:
                t = q['type'] or 'string'
                schema = {'type': 'string'}
                if re.fullmatch(r"('[^']+'\s*\|?\s*)+", t.replace('undefined', '').strip(' |')):
                    schema['enum'] = re.findall(r"'([^']+)'", t)
                o.setdefault('parameters', []).append({'name': q['name'], 'in': 'query', 'required': not q['optional'], 'schema': schema})
        one = NOUN.get(tag, ('item',))[0]
        for p in o.get('parameters', []):
            if p['in'] == 'path' and not p.get('description'):
                n = p['name']
                CAP = {'service': 'Service', 'environment': 'Environment', 'application': 'Application', 'project': 'Project', 'deployment': 'Deployment', 'compose': 'Compose stack', 'server': 'Server', 'organization': 'Organization', 'agent': 'Agent', 'domain': 'Domain', 'uptime check': 'uptime check', 'redirect': 'redirect'}
                if n == 'id': p['description'] = f"The {one}'s id." if one != 'item' else 'The id.'
                elif n.endswith('Id'):
                    w = ' '.join(words(n[:-2])); w = CAP.get(w, w)
                    p['description'] = f"The {w}'s id."
                else: p['description'] = ' '.join(words(n)).capitalize() + '.'
        for r in o['responses'].values():
            if r.get('description'):
                r['description'] = re.sub(r'\s*\(ADR-?\d+[^)]*\)', '', r['description']).replace("better-auth's member list", 'The member list')
        out_paths.setdefault(path, {})[method] = o

# Keep only the schemas still referenced.
schemas = d['components']['schemas']
used = set()
def walk(v):
    if isinstance(v, dict):
        r = v.get('$ref')
        if r and r.startswith('#/components/schemas/'):
            n = r.split('/')[-1]
            if n not in used:
                used.add(n); walk(schemas[n])
        for vv in v.values(): walk(vv)
    elif isinstance(v, list):
        for vv in v: walk(vv)
walk(out_paths)

doc = {
  'openapi': d['openapi'],
  'info': {
    'title': 'Cloudgate API',
    'version': d['info']['version'],
    'description': 'The REST API of a Cloudgate instance: everything the console does, for scripts and CI. Authenticate with a Personal key in the x-api-key header and name the Organization to act in with x-organization-id. On the Hosted instance the base URL is https://cloudgate.octabyte.app/backend; on a Self-hosted instance it is your console address followed by /backend. Request shapes are generated from the schemas the server validates against. Operator-only, webhook and internal routes are left out of this public copy. Reference: https://cloudgate.octabyte.io/docs/api',
  },
  'servers': [{'url': 'https://cloudgate.octabyte.app/backend', 'description': 'Hosted instance'},
              {'url': '{console}/backend', 'description': 'Self-hosted instance', 'variables': {'console': {'default': 'https://cloud.example.com', 'description': 'Your console address'}}}],
  'security': [{'personalKey': []}, {'personalKey': [], 'organization': []}, {'cookie': []}],
  'paths': out_paths,
  'components': {
    'securitySchemes': {
      'personalKey': {'type': 'apiKey', 'in': 'header', 'name': 'x-api-key', 'description': 'A Personal key, made in the console under Personal keys or by cloudgate login. Agent keys are refused on every REST route (403 AGENT_NOT_ALLOWED_HERE).'},
      'organization': {'type': 'apiKey', 'in': 'header', 'name': 'x-organization-id', 'description': 'The Organization the request acts in. Optional: without it, the key acts in your default Organization. A Organization you are not a member of is refused with 403 NOT_ORGANIZATION_MEMBER.'},
      'cookie': d['components']['securitySchemes']['cookie'],
    },
    'schemas': {k: schemas[k] for k in sorted(used)},
  },
}
doc['components']['securitySchemes']['organization']['description'] = doc['components']['securitySchemes']['organization']['description'].replace('A Organization', 'An Organization')
json.dump(doc, open(OUT, 'w'), indent=1, ensure_ascii=False)
n = sum(len(v) for v in out_paths.values())
print('ops', n, 'schemas', len(used), 'excluded', len(excluded_list))
for e in excluded_list: print(' ', *e)

export const roadmapsData = [
  {
    id: 'web-development',
    title: 'Web Development',
    summary: 'Build polished, scalable web experiences from the browser to production APIs.',
    theme: {
      accent: '#4F7CFF',
      accentDark: '#2F5CE0',
      glow: '#9DC1FF',
      confettiColors: ['#4F7CFF', '#9DC1FF', '#63C2B5', '#F4F8FF'],
      motionSignature: 'flow-wave',
    },
    milestones: [
      {
        id: 'web-html-css-core',
        title: 'HTML, CSS, and Layout Systems',
        description: 'Master semantic structure, accessible markup, and modern responsive design systems.',
        microSteps: [
          'Semantic HTML elements and document landmarks',
          'Accessibility foundations (labels, roles, keyboard navigation)',
          'CSS box model and positioning strategies',
          'Flexbox and CSS Grid for adaptive layouts',
          'Responsive design with breakpoints and fluid units',
          'Design tokens, spacing systems, and typographic scales',
          'Cross-browser debugging with devtools',
        ],
        capstoneProject:
          'Design and ship a fully responsive product landing page with accessibility score above 90 and reusable layout primitives.',
      },
      {
        id: 'web-javascript-react',
        title: 'JavaScript and React Foundations',
        description: 'Build interactive interfaces with modern JavaScript patterns and component architecture.',
        microSteps: [
          'ES6+ syntax, modules, and asynchronous workflows',
          'State management with React hooks',
          'Component composition and prop-driven architecture',
          'Form handling and validation patterns',
          'Client-side routing and guarded routes',
          'API integration with loading and error states',
          'Performance basics (memoization and lazy loading)',
        ],
        capstoneProject:
          'Build a multi-page React app with authenticated routes, reusable components, and optimistic API updates.',
      },
      {
        id: 'web-backend-deploy',
        title: 'Backend Integration and Deployment',
        description: 'Connect frontend clients to secure APIs and deploy with reliable release workflows.',
        microSteps: [
          'REST API design principles and versioning',
          'Token-based authentication patterns',
          'Input validation and API error boundaries',
          'Environment variable management across environments',
          'CI pipelines for linting and build checks',
          'Deployment fundamentals on cloud hosting platforms',
          'Monitoring, logs, and rollback strategies',
        ],
        capstoneProject:
          'Deploy a full-stack web app with CI/CD, environment-specific configs, and observability dashboards.',
      },
      {
        id: 'web-typescript-testing',
        title: 'TypeScript, Testing, and Code Quality',
        description: 'Raise maintainability with strong typing, robust tests, and scalable code standards.',
        microSteps: [
          'TypeScript fundamentals and strict mode setup',
          'Typing React components, hooks, and API contracts',
          'Unit testing with Vitest/Jest and Testing Library',
          'Integration testing for route and data flows',
          'Mocking APIs and network failure handling',
          'Linting and formatting with shared configs',
          'Code review checklists and architectural decision records',
        ],
        capstoneProject:
          'Migrate a React module to strict TypeScript with full unit/integration test coverage and quality gates in CI.',
      },
      {
        id: 'web-performance-security',
        title: 'Performance, Security, and SEO',
        description: 'Optimize user experience while hardening frontend and backend boundaries.',
        microSteps: [
          'Core Web Vitals and render bottleneck profiling',
          'Code splitting, lazy loading, and route prefetching',
          'Caching headers and CDN distribution strategy',
          'Security headers, CSP, and XSS mitigations',
          'Authentication token storage best practices',
          'Metadata, structured data, and crawlability',
          'Image, font, and asset optimization pipelines',
        ],
        capstoneProject:
          'Ship a production web app that scores above 90 in Lighthouse Performance, Accessibility, and SEO with secure response headers.',
      },
      {
        id: 'web-system-design',
        title: 'Scalable Architecture and System Design',
        description: 'Design frontend and API systems for long-term growth and reliability.',
        microSteps: [
          'Frontend monolith vs modular architecture tradeoffs',
          'API gateway, BFF, and microservice integration patterns',
          'Rate limiting, circuit breakers, and retry budgets',
          'Feature flags and progressive delivery workflows',
          'Observability dashboards and SLO-driven reliability',
          'Data modeling and eventual consistency basics',
          'Cost-performance optimization for cloud deployments',
        ],
        capstoneProject:
          'Design and document a scalable web platform architecture with reliability, rollout, and observability strategies.',
      },
    ],
  },
  {
    id: 'app-development',
    title: 'App Development',
    summary: 'Ship robust cross-platform mobile experiences with strong architecture and release discipline.',
    theme: {
      accent: '#34A6A0',
      accentDark: '#248884',
      glow: '#8BD8D4',
      confettiColors: ['#34A6A0', '#8BD8D4', '#4F7CFF', '#E9F0FF'],
      motionSignature: 'lift-fade',
    },
    milestones: [
      {
        id: 'app-mobile-core',
        title: 'Mobile UI and Navigation Foundations',
        description: 'Create performant interfaces and intuitive navigation patterns for mobile users.',
        microSteps: [
          'Platform UI conventions for iOS and Android',
          'Reusable component systems for mobile views',
          'Navigation stacks, tabs, and deep linking',
          'Safe area, gestures, and touch feedback',
          'Device state handling (orientation, permissions)',
          'Local storage and offline caching strategies',
          'Accessibility for screen readers and contrast',
        ],
        capstoneProject:
          'Build a cross-platform task management app with offline mode, deep links, and accessibility-first UI.',
      },
      {
        id: 'app-state-api',
        title: 'State, APIs, and Sync Patterns',
        description: 'Synchronize local and remote data while preserving responsive user experiences.',
        microSteps: [
          'Normalized client state design',
          'Remote data fetching and cache invalidation',
          'Background syncing and retry queues',
          'Optimistic updates and rollback handling',
          'Push notification workflow basics',
          'Secure token storage on mobile devices',
          'Crash reporting and analytics instrumentation',
        ],
        capstoneProject:
          'Implement authenticated sync for a collaborative note app with optimistic updates and background retries.',
      },
      {
        id: 'app-release-quality',
        title: 'Testing and Production Release',
        description: 'Improve quality and confidence through test automation and release governance.',
        microSteps: [
          'Unit and integration testing for app logic',
          'End-to-end flow coverage for mission-critical journeys',
          'Performance profiling on low-end devices',
          'Feature flag rollouts and staged releases',
          'Store listing optimization and compliance checks',
          'Release notes and incident communication process',
          'Post-release telemetry and iteration loops',
        ],
        capstoneProject:
          'Ship a production-ready mobile release with CI checks, staged rollout controls, and health monitoring.',
      },
      {
        id: 'app-native-platform',
        title: 'Native Device and Platform Capabilities',
        description: 'Leverage advanced hardware features and platform APIs without compromising UX.',
        microSteps: [
          'Camera, gallery, and file-system integrations',
          'Location services and geofencing workflows',
          'Biometric authentication and secure enclave basics',
          'Background tasks, jobs, and battery constraints',
          'Push notifications with deep action handling',
          'Permission rationale and fallback UX design',
          'Bridging native modules for performance hotspots',
        ],
        capstoneProject:
          'Build a field-ops mobile app that uses camera capture, geolocation, push alerts, and biometric sign-in.',
      },
      {
        id: 'app-architecture-scalability',
        title: 'App Architecture and Team Scalability',
        description: 'Design mobile codebases that remain healthy across large teams and rapid release cycles.',
        microSteps: [
          'Feature-based folder structures and module boundaries',
          'State architecture patterns (MVVM, Redux, clean architecture)',
          'Design systems for mobile components and themes',
          'Experimentation frameworks and analytics-driven iteration',
          'Error boundary strategy and graceful degradation',
          'CI pipelines for build matrix and device farms',
          'Release automation and semantic versioning workflows',
        ],
        capstoneProject:
          'Create a scalable mobile architecture blueprint and automation pipeline for a multi-team product.',
      },
      {
        id: 'app-security-compliance',
        title: 'Mobile Security and Compliance Readiness',
        description: 'Protect user data and satisfy platform compliance requirements in production.',
        microSteps: [
          'Secure storage and keychain/keystore handling',
          'Certificate pinning and secure network layers',
          'Tamper detection and jailbreak/root heuristics',
          'PII minimization and privacy-safe analytics',
          'GDPR/CCPA consent and data retention workflows',
          'Dependency vulnerability scanning for mobile projects',
          'Threat modeling for mobile attack surfaces',
        ],
        capstoneProject:
          'Harden a production mobile app with secure storage, pinned TLS, and privacy compliance controls.',
      },
    ],
  },
  {
    id: 'devops',
    title: 'DevOps',
    summary: 'Automate, secure, and scale delivery pipelines from source code to production operations.',
    theme: {
      accent: '#5A6CF6',
      accentDark: '#3E4ECF',
      glow: '#AAB5FF',
      confettiColors: ['#5A6CF6', '#AAB5FF', '#6A84FF', '#DCE4FF'],
      motionSignature: 'rail-slide',
    },
    milestones: [
      {
        id: 'devops-linux-fundamentals',
        title: 'Linux Fundamentals',
        description: 'Develop practical command-line fluency and operating system operational confidence.',
        microSteps: [
          'File System Architecture',
          'Basic Commands (ls, cd, mkdir, chmod)',
          'Package Managers (apt, yum)',
          'Process Management (ps, top, kill)',
          'User & Group Permissions',
          'SSH & Remote Access',
          'Shell Scripting Basics',
          'Cron Jobs & Automation',
        ],
        capstoneProject:
          'Build a Bash script that monitors CPU usage and automatically compresses and backs up log files to a secure directory.',
      },
      {
        id: 'devops-version-control-git',
        title: 'Version Control & Git',
        description: 'Establish clean collaboration workflows and reliable source-control governance.',
        microSteps: [
          'Git Architecture (Working Directory vs Staging)',
          'Branching & Merging',
          'Handling Merge Conflicts',
          'Rebasing vs Merging',
          'Stashing Changes',
          'GitHub Pull Requests & Code Reviews',
          'Git Hooks',
        ],
        capstoneProject:
          'Set up a GitHub repository with strict branch protection rules and an automated GitHub Actions workflow that runs linting tests on every pull request.',
      },
      {
        id: 'devops-ci-cd-delivery',
        title: 'CI/CD and Delivery Automation',
        description: 'Build repeatable pipelines that test, package, and deploy software safely.',
        microSteps: [
          'Pipeline stages for build, test, scan, and deploy',
          'Artifact versioning and release provenance',
          'Environment promotion and approval gates',
          'Secrets management for CI platforms',
          'Container image scanning and policy checks',
          'Rollback and blue-green deployment strategies',
          'Deployment health checks and smoke tests',
        ],
        capstoneProject:
          'Create a multi-environment deployment pipeline that enforces security scans and performs automated rollback on failed health checks.',
      },
      {
        id: 'devops-containerization-docker',
        title: 'Containerization with Docker',
        description: 'Package applications reliably using container standards and image lifecycle best practices.',
        microSteps: [
          'Docker architecture (images, containers, layers)',
          'Writing optimized multi-stage Dockerfiles',
          'Bind mounts, named volumes, and persistent data',
          'Docker networking and service communication',
          'Docker Compose for local multi-service orchestration',
          'Image registries, tagging strategy, and immutability',
          'Container security scanning and least-privilege runtime',
        ],
        capstoneProject:
          'Containerize a multi-service application with multi-stage Dockerfiles, secure runtime settings, and Docker Compose orchestration.',
      },
      {
        id: 'devops-kubernetes-orchestration',
        title: 'Kubernetes Orchestration',
        description: 'Deploy and operate resilient workloads on Kubernetes clusters.',
        microSteps: [
          'Core objects: Pods, Deployments, Services, ConfigMaps, Secrets',
          'Cluster architecture and control-plane components',
          'Ingress controllers and traffic routing patterns',
          'Autoscaling with HPA and resource requests/limits',
          'Rolling updates, rollbacks, and readiness probes',
          'Stateful workloads with StatefulSets and PVCs',
          'Helm charts and GitOps-style release management',
        ],
        capstoneProject:
          'Deploy a production-style microservice platform on Kubernetes with autoscaling, ingress routing, and Helm-based release workflows.',
      },
      {
        id: 'devops-aws-cloud-services',
        title: 'AWS Core Services for DevOps',
        description: 'Build cloud-native infrastructure and delivery pipelines with foundational AWS services.',
        microSteps: [
          'IAM roles, policies, and least privilege governance',
          'VPC design, subnets, route tables, and security groups',
          'Compute options: EC2, ECS, EKS, Lambda tradeoffs',
          'Storage and databases: S3, EBS, RDS, DynamoDB basics',
          'CloudWatch metrics, logs, and alarm automation',
          'CodePipeline/CodeBuild and deployment automation',
          'Cost optimization with tagging, budgets, and rightsizing',
        ],
        capstoneProject:
          'Provision a secure AWS environment and implement a CI/CD pipeline deploying containerized apps with monitoring and budget controls.',
      },
      {
        id: 'devops-iac-observability',
        title: 'Infrastructure as Code and Observability',
        description: 'Manage infrastructure declaratively and operate systems with strong telemetry practices.',
        microSteps: [
          'Terraform module design and remote state management',
          'Policy as code and compliance guardrails',
          'Observability pillars: metrics, logs, traces',
          'Prometheus/Grafana dashboards and SLO tracking',
          'Alert tuning and incident escalation workflows',
          'Runbooks and postmortem-driven reliability loops',
          'Disaster recovery planning and game-day exercises',
        ],
        capstoneProject:
          'Implement Terraform-driven infrastructure with end-to-end observability, alerts, and disaster recovery runbooks.',
      },
    ],
  },
  {
    id: 'cybersecurity',
    title: 'Cybersecurity',
    summary: 'Understand, test, and harden systems through practical offensive and defensive workflows.',
    theme: {
      accent: '#3A77C4',
      accentDark: '#2A5C99',
      glow: '#8BB2E5',
      confettiColors: ['#3A77C4', '#8BB2E5', '#4F7CFF', '#E9F0FF'],
      motionSignature: 'scan-pulse',
    },
    milestones: [
      {
        id: 'cyber-security-basics',
        title: 'Security Foundations and Threat Modeling',
        description: 'Establish core security principles and model realistic system threats.',
        microSteps: [
          'CIA triad and risk classification basics',
          'Threat modeling with attack surfaces and trust boundaries',
          'Identity, authentication, and authorization controls',
          'Network segmentation and least privilege design',
          'Secure configuration baselines for servers and endpoints',
          'Security logging essentials and audit trail design',
          'Incident response lifecycle overview',
        ],
        capstoneProject:
          'Produce a complete threat model and control matrix for a public-facing SaaS application.',
      },
      {
        id: 'cyber-web-app-security',
        title: 'Web Application Security',
        description: 'Identify and remediate common vulnerabilities in modern web platforms.',
        microSteps: [
          'OWASP Top 10 vulnerability patterns',
          'Input validation and output encoding strategies',
          'Session security and token hardening',
          'CSRF and CORS policy design',
          'Dependency risk and supply chain scanning',
          'Security testing with dynamic and static tooling',
          'Patch management workflows',
        ],
        capstoneProject:
          'Harden a demo web app by finding and fixing OWASP-critical vulnerabilities with documented mitigation evidence.',
      },
      {
        id: 'cyber-monitoring-response',
        title: 'Monitoring and Incident Response',
        description: 'Build operational readiness through detection rules, triage playbooks, and response drills.',
        microSteps: [
          'SIEM query fundamentals and alert tuning',
          'Detection engineering with high-signal rules',
          'Triage prioritization using severity scoring',
          'Forensic evidence collection and chain of custody',
          'Containment and eradication runbooks',
          'Post-incident review and lessons learned',
          'Security awareness communication plans',
        ],
        capstoneProject:
          'Run a full incident simulation and deliver a postmortem with root cause, timeline, and control improvements.',
      },
      {
        id: 'cyber-network-security',
        title: 'Network Security and Zero Trust',
        description: 'Design and validate network-layer controls that reduce blast radius and lateral movement risk.',
        microSteps: [
          'Firewall strategies and micro-segmentation principles',
          'IDS/IPS architecture and packet inspection workflows',
          'VPN models and secure remote-access controls',
          'Zero trust access architecture fundamentals',
          'DNS security, DDoS protection, and traffic filtering',
          'Secure network baselines and hardening standards',
          'Network threat hunting with flow telemetry',
        ],
        capstoneProject:
          'Design and test a zero-trust network blueprint with segmented zones, monitored ingress, and attack-path validation.',
      },
      {
        id: 'cyber-cloud-security',
        title: 'Cloud Security and Identity Governance',
        description: 'Secure cloud workloads through identity controls, policy enforcement, and automated checks.',
        microSteps: [
          'Shared responsibility model across cloud providers',
          'Cloud IAM governance and privilege management',
          'Secrets lifecycle and rotation automation',
          'Cloud security posture management (CSPM) workflows',
          'Container and Kubernetes security basics',
          'Infrastructure policy scanning in CI/CD',
          'Cloud incident forensics and timeline reconstruction',
        ],
        capstoneProject:
          'Secure a cloud-native stack with IAM guardrails, policy-as-code checks, and continuous posture monitoring.',
      },
      {
        id: 'cyber-red-blue-operations',
        title: 'Red Team and Blue Team Operations',
        description: 'Develop practical offense-defense collaboration and continuous improvement loops.',
        microSteps: [
          'Adversary emulation and MITRE ATT&CK mapping',
          'Purple-team exercises and detection validation',
          'Phishing simulation design and reporting metrics',
          'Endpoint detection and response (EDR) workflows',
          'Breach and attack simulation tooling fundamentals',
          'Tabletop exercises and crisis communications',
          'Security metrics, KPIs, and maturity tracking',
        ],
        capstoneProject:
          'Execute a full red-blue simulation cycle and deliver measurable detection coverage improvements.',
      },
    ],
  },
];

export function getRoadmapById(id) {
  return roadmapsData.find((roadmap) => roadmap.id === id);
}

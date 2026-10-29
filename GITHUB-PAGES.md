# Hosting audraevincent.com on GitHub Pages

The site is plain HTML, CSS, and JavaScript in `dist/`. The workflow in `.github/workflows/deploy-pages.yml` publishes that directory when updates are pushed to `main`. No build command or package installation is required.

## GitHub setup — completed

- Public repository: [audraev/audrae-vincent-portfolio](https://github.com/audraev/audrae-vincent-portfolio).
- Source: `main`, with **Settings → Pages → Source** set to **GitHub Actions**.
- The [first Pages deployment](https://github.com/audraev/audrae-vincent-portfolio/actions/runs/40815079416) completed successfully on October 28, 2026.
- **Settings → Pages → Custom domain** is already set to `audraevincent.com`. A custom Actions workflow uses this setting; a `CNAME` file alone does not configure the domain.

The domain setup is complete. The public portfolio is at [https://audraevincent.com/](https://audraevincent.com/). GitHub has approved its HTTPS certificate and HTTPS enforcement is enabled. The secure `www` address redirects to the primary domain. DNS and secure responses were verified on October 28, 2026.

Updating files in `dist/` and pushing to `main` deploys future site changes automatically. Documentation-only commits do not trigger a deployment.

## Namecheap DNS

The following records are configured in **Domain List → Manage** next to `audraevincent.com`, then **Advanced DNS → Host Records**. The domain uses Namecheap nameservers. Preserve unrelated email and domain verification records when maintaining this configuration.

| Type | Host | Value | TTL |
| --- | --- | --- | --- |
| A Record | @ | 185.199.108.153 | Automatic |
| A Record | @ | 185.199.109.153 | Automatic |
| A Record | @ | 185.199.110.153 | Automatic |
| A Record | @ | 185.199.111.153 | Automatic |
| CNAME Record | www | audraev.github.io | Automatic |

The `www` target is the GitHub username's domain, without a repository path. GitHub redirects `www.audraevincent.com` to the configured primary address, `audraevincent.com`.

**Enforce HTTPS** is enabled in **Settings → Pages**. After future DNS changes, allow time for cached records to refresh and verify both domain addresses.

## Optional domain ownership verification

Under the GitHub account's **Settings → Pages**, add and verify `audraevincent.com`. GitHub supplies a unique TXT record to add in Namecheap. Use the exact value GitHub returns; it cannot be pre-generated locally.

## References

- [GitHub's workflow instructions](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
- [GitHub's custom-domain instructions](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)
- [Namecheap's GitHub Pages instructions](https://www.namecheap.com/support/knowledgebase/article.aspx/9645/2208/how-do-i-link-my-domain-to-github-pages/)

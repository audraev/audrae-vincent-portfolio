# Hosting audraevincent.com on GitHub Pages

The site is plain HTML, CSS, and JavaScript in `dist/`. The workflow in `.github/workflows/deploy-pages.yml` publishes that directory when updates are pushed to `main`. No build command or package installation is required.

## GitHub setup

1. Create a public repository under `audraev` for this portfolio and push this source to its `main` branch. The planned repository name is `audrae-vincent-portfolio`; check that this name is available before creating it.
2. In the repository's **Settings → Pages**, set **Source** to **GitHub Actions**.
3. Run **Actions → Deploy portfolio to GitHub Pages → Run workflow**, or push an update to `dist/` on `main`.
4. In **Settings → Pages → Custom domain**, enter `audraevincent.com` and save it **before** changing the Namecheap DNS records. A custom Actions workflow uses this setting; a `CNAME` file alone does not configure the domain.

## Namecheap DNS

Open **Domain List → Manage** next to `audraevincent.com`, then **Advanced DNS → Host Records**. The domain currently uses Namecheap nameservers. Replace the parking/redirect records for `@` and `www` with the following. Preserve unrelated email and domain verification records.

| Type | Host | Value | TTL |
| --- | --- | --- | --- |
| A Record | @ | 185.199.108.153 | Automatic |
| A Record | @ | 185.199.109.153 | Automatic |
| A Record | @ | 185.199.110.153 | Automatic |
| A Record | @ | 185.199.111.153 | Automatic |
| CNAME Record | www | audraev.github.io | Automatic |

The `www` target is the GitHub username's domain, without a repository path. GitHub redirects `www.audraevincent.com` to the configured primary address, `audraevincent.com`.

Once GitHub's DNS check passes and the certificate is issued, enable **Enforce HTTPS** in **Settings → Pages**. DNS and certificate provisioning may take up to 24 hours. Verify both addresses and the project navigation before using the URL on a resume.

## Optional domain ownership verification

Under the GitHub account's **Settings → Pages**, add and verify `audraevincent.com`. GitHub supplies a unique TXT record to add in Namecheap. Use the exact value GitHub returns; it cannot be pre-generated locally.

## References

- [GitHub's workflow instructions](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
- [GitHub's custom-domain instructions](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)
- [Namecheap's GitHub Pages instructions](https://www.namecheap.com/support/knowledgebase/article.aspx/9645/2208/how-do-i-link-my-domain-to-github-pages/)

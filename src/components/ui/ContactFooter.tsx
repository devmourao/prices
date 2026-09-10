import { useTranslation } from 'react-i18next'
import { Briefcase, ExternalLink, FolderGit2, Globe, Mail } from 'lucide-react'
import { CONTACT } from '../../app/contact'

/**
 * Persistent author/contact footer (SPEC-009). Subtle by design:
 * the calculator is the hero, this is the signature.
 */
export function ContactFooter() {
  const { t } = useTranslation()
  const links = [
    { href: CONTACT.siteUrl, label: t('footer.site'), Icon: Globe },
    { href: `mailto:${CONTACT.email}`, label: t('footer.email'), Icon: Mail },
    { href: CONTACT.githubUrl, label: t('footer.github'), Icon: FolderGit2 },
    { href: CONTACT.linkedinUrl, label: t('footer.linkedin'), Icon: Briefcase },
    { href: CONTACT.projectUrl, label: t('footer.project'), Icon: ExternalLink },
  ]
  return (
    <footer className="flex flex-col items-center gap-2 py-4 text-center">
      <p className="text-sm text-muted">{t('footer.madeBy', { name: CONTACT.name })}</p>
      <nav aria-label={t('footer.contact')} className="flex items-center gap-1">
        {links.map(({ href, label, Icon }) => (
          <a
            key={label}
            href={href}
            target={href.startsWith('mailto:') ? undefined : '_blank'}
            rel={href.startsWith('mailto:') ? undefined : 'noreferrer'}
            aria-label={label}
            title={label}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-muted transition-colors hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <Icon size={18} aria-hidden="true" />
          </a>
        ))}
      </nav>
    </footer>
  )
}

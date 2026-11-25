import type { ReactNode } from 'react';
import { classNames } from '@junipero/react';

import type { PreviewMode } from '../types';
import ArticlePreviewIcon from '../Icon/ArticlePreviewIcon';
import CloseIcon from '../Icon/CloseIcon';
import DrawerPreviewIcon from '../Icon/DrawerPreviewIcon';
import ModalPreviewIcon from '../Icon/ModalPreviewIcon';
import PagePreviewIcon from '../Icon/PagePreviewIcon';

const Bar = ({ className, width }: { className?: string; width: string }) => (
  <div
    className={classNames('oak:h-2.5 oak:rounded-full oak:bg-cv-line', className)}
    style={{ width }}
  />
);

const Paragraph = ({ lines = 4 }: { lines?: number }) => (
  <div className="oak:flex oak:flex-col oak:gap-2.5">
    { Array.from({ length: lines }).map((_, i) => (
      <Bar key={i} width={i === lines - 1 ? '62%' : `${96 - (i % 3) * 4}%`} />
    )) }
  </div>
);

export const SiteHeader = () => (
  <div
    className={classNames(
      'oak:flex oak:items-center oak:justify-between oak:gap-4 oak:h-14',
      'oak:px-6 oak:border-b oak:border-cv-border oak:bg-cv-site',
    )}
  >
    <div className="oak:flex oak:items-center oak:gap-2">
      <div className="oak:w-6 oak:h-6 oak:rounded oak:bg-cv-strong" />
      <Bar width="88px" className="oak:opacity-70" />
    </div>
    <div className="oak:flex oak:items-center oak:gap-4">
      <Bar width="48px" />
      <Bar width="48px" />
      <Bar width="48px" />
    </div>
  </div>
);

/**
 * Beginning of a fake article: title, chapô & a few paragraphs
 */
export const ArticleSkeleton = ({
  paragraphs = 2,
  fade = false,
}: {
  paragraphs?: number;
  fade?: boolean;
}) => (
  <div className="oak:flex oak:flex-col oak:gap-6">
    <div className="oak:flex oak:flex-col oak:gap-3">
      <Bar width="72px" className="oak:bg-velvet/50" />
      <div className="oak:h-6 oak:w-[90%] oak:rounded-md oak:bg-cv-strong" />
      <div className="oak:h-6 oak:w-[60%] oak:rounded-md oak:bg-cv-strong" />
    </div>
    <div className="oak:h-40 oak:rounded-lg oak:bg-cv-media" />
    { Array.from({ length: paragraphs }).map((_, i) => (
      <div
        key={i}
        className={classNames('oak:relative', {
          // Last visible paragraph fades out above the previewed content
          'oak:[mask-image:linear-gradient(to_bottom,black,transparent)]':
            fade && i === paragraphs - 1,
        })}
      >
        <Paragraph lines={i % 2 ? 3 : 4} />
      </div>
    )) }
  </div>
);

const Website = ({ children }: { children?: ReactNode }) => (
  <div
    className={classNames(
      'oak:relative oak:bg-cv-site oak:shadow-sm oak:overflow-hidden',
      'oak:select-none',
    )}
  >
    <SiteHeader />
    { children }
  </div>
);

const BackgroundArticle = () => (
  <div className="oak:absolute oak:inset-x-0 oak:top-14 oak:bottom-0">
    <div className="oak:max-w-[680px] oak:mx-auto oak:px-6 oak:py-10">
      <ArticleSkeleton paragraphs={6} />
    </div>
  </div>
);

export const pagePreviewMode = (): PreviewMode => ({
  id: 'page',
  name: t => t('ash.preview.modes.page', 'Full page'),
  icon: <PagePreviewIcon />,
  frameClassName: 'oak:bg-cv-page oak:shadow-sm oak:min-h-[480px]',
});

export const articlePreviewMode = (): PreviewMode => ({
  id: 'article',
  name: t => t('ash.preview.modes.article', 'Inside an article'),
  icon: <ArticlePreviewIcon />,
  frameClassName: 'oak:bg-cv-page',
  render: ({ children }) => (
    <Website>
      <div
        className={classNames(
          'oak:max-w-[680px] oak:mx-auto oak:px-6 oak:pt-10 oak:pb-16',
          'oak:flex oak:flex-col oak:gap-6',
        )}
      >
        <ArticleSkeleton paragraphs={2} fade />
        <div className="oak:select-text">{ children }</div>
      </div>
    </Website>
  ),
});

export const modalPreviewMode = (): PreviewMode => ({
  id: 'modal',
  name: t => t('ash.preview.modes.modal', 'Modal'),
  icon: <ModalPreviewIcon />,
  frameClassName: 'oak:bg-cv-page',
  render: ({ children }) => (
    <Website>
      <div className="oak:relative oak:min-h-[720px]">
        <BackgroundArticle />
        <div className="oak:absolute oak:inset-0 oak:bg-cv-backdrop" />
        <div
          className={classNames(
            'oak:relative oak:flex oak:justify-center oak:px-4 oak:py-20',
          )}
        >
          <div
            className={classNames(
              'oak:relative oak:w-full oak:max-w-[560px] oak:bg-cv-page',
              'oak:rounded-xl oak:shadow-xl oak:p-6 oak:select-text',
            )}
          >
            <div
              aria-hidden
              className={classNames(
                'oak:absolute oak:top-3 oak:right-3 oak:w-6 oak:h-6',
                'oak:flex oak:items-center oak:justify-center oak:text-cv-label',
              )}
            >
              <CloseIcon />
            </div>
            { children }
          </div>
        </div>
      </div>
    </Website>
  ),
});

export const drawerPreviewMode = (): PreviewMode => ({
  id: 'drawer',
  name: t => t('ash.preview.modes.drawer', 'Bottom drawer'),
  icon: <DrawerPreviewIcon />,
  frameClassName: 'oak:bg-cv-page',
  render: ({ children }) => (
    <Website>
      <div className="oak:relative oak:min-h-[720px] oak:flex oak:flex-col">
        <BackgroundArticle />
        <div className="oak:absolute oak:inset-0 oak:bg-cv-backdrop oak:opacity-40" />
        <div className="oak:flex-auto oak:min-h-60" />
        <div
          className={classNames(
            'oak:relative oak:bg-cv-page oak:rounded-t-2xl oak:px-6 oak:pt-3',
            'oak:pb-8 oak:shadow-[0_-8px_30px_var(--junipero-shadow)]',
            'oak:select-text',
          )}
        >
          <div
            aria-hidden
            className={classNames(
              'oak:w-10 oak:h-1 oak:rounded-full oak:bg-cv-line oak:mx-auto',
              'oak:mb-5',
            )}
          />
          <div className="oak:max-w-[720px] oak:mx-auto">{ children }</div>
        </div>
      </div>
    </Website>
  ),
});

export const defaultPreviewModes = (): PreviewMode[] => [
  pagePreviewMode(),
  articlePreviewMode(),
  modalPreviewMode(),
  drawerPreviewMode(),
];

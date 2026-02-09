import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import classes from './index.module.less';
import { CopyIcon, CheckIcon, LoadingIcon } from '@/components/icons';
import { copyToCommand } from '@/utils/common';
import { useGlobalLocale } from '@/hooks/use-global-locale';
import { LanguageEnum } from '@/types/localization';
import { useRouter } from 'next/router';
import { ABSOLUTE_BASE_URL, MILVUS_RAW_DOCS_BASE_URL } from '@/consts';

enum PageAction {
  CopyPage = 'copy-page',
  ViewMarkdown = 'view-markdown',
  ChatGPT = 'chat-chatgpt',
  ChatClaude = 'chat-claude',
  ChatGemini = 'chat-gemini',
}

type CopyStatus = 'idle' | 'loading' | 'success';

export interface OptionItem {
  value: PageAction;
  labelKey: string;
  descKey: string;
  icon?: ReactNode;
}

interface LLMActionsProps {
  options: OptionItem[];
  githubLink?: string;
  classes?: {
    root?: string;
  };
  mdContent?: string;
}

export { PageAction };

export default function LLMActions(props: LLMActionsProps) {
  const { options, githubLink, classes: customClasses, mdContent: propsMdContent = '' } = props;
  const { root = '' } = customClasses || {};
  const { t } = useTranslation('llm');
  const { locale } = useGlobalLocale();
  const { asPath } = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [copyStatus, setCopyStatus] = useState<CopyStatus>('idle');
  const containerRef = useRef<HTMLDivElement>(null);
  const [mdContent, setMdContent] = useState<string>(propsMdContent);

  const defaultOption = options[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCopyPage = async () => {
    try {
      if (!mdContent) {
        throw new Error('No Markdown content found');
      }
      await copyToCommand(mdContent);
      setCopyStatus('success');
      setTimeout(() => {
        setCopyStatus('idle');
      }, 3000);
    } catch (error) {
      console.error('Error copying Markdown file:', error);
      setCopyStatus('idle');
    }
  };

  const handleAction = async (value: PageAction) => {
    const preFilledPrompt = t('pageActions.prompt', {
      url: `${ABSOLUTE_BASE_URL}${asPath}`,
    });

    switch (value) {
      case PageAction.CopyPage: {
        await handleCopyPage();
        break;
      }
      case PageAction.ViewMarkdown: {
        if (githubLink) {
          window.open(githubLink, '_blank');
        }
        break;
      }
      case PageAction.ChatGPT: {
        window.open(
          `https://chatgpt.com/?q=${encodeURIComponent(preFilledPrompt)}`,
          '_blank'
        );
        break;
      }
      case PageAction.ChatClaude: {
        window.open(
          `https://claude.ai/new?q=${encodeURIComponent(preFilledPrompt)}`,
          '_blank'
        );
        break;
      }
      case PageAction.ChatGemini: {
        window.open(
          `https://gemini.google.com/app?q=${encodeURIComponent(preFilledPrompt)}`,
          '_blank'
        );
        break;
      }
    }

    setIsOpen(false);
  };

  const handleDefaultClick = () => {
    handleAction(defaultOption.value);
  };

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(prev => !prev);
  };

  const renderButtonIcon = () => {
    if (copyStatus === 'loading') {
      return <LoadingIcon />;
    }
    if (copyStatus === 'success') {
      return <CheckIcon />;
    }
    return <CopyIcon />;
  };

  useEffect(() => {
    if (githubLink) {
      fetch(githubLink)
        .then(response => response.text())
        .then(data => setMdContent(data))
        .catch(error => console.error('Error fetching MD file:', error));
    }
  }, [githubLink]);

  if (locale !== LanguageEnum.ENGLISH) {
    return null;
  }

  return (
    <div className={clsx(classes.container, root)} ref={containerRef}>
      <div className={classes.splitButton}>
        <button
          className={classes.mainButton}
          onClick={handleDefaultClick}
          title={t(defaultOption.descKey)}
          disabled={copyStatus === 'loading' || !mdContent}
        >
          <span
            className={clsx(classes.buttonIcon, {
              [classes.spinning]: copyStatus === 'loading',
            })}
          >
            {renderButtonIcon()}
          </span>
          <span>{t(defaultOption.labelKey)}</span>
        </button>
        <button
          className={classes.dropdownToggle}
          onClick={toggleDropdown}
          aria-expanded={isOpen}
        >
          <ChevronDown
            size={16}
            className={clsx(classes.chevron, {
              [classes.chevronOpen]: isOpen,
            })}
          />
        </button>
      </div>

      {isOpen && (
        <div className={classes.dropdown}>
          {options.map(option => (
            <button
              key={option.value}
              className={classes.dropdownItem}
              onClick={() => handleAction(option.value)}
            >
              <span className={classes.itemIcon}>{option.icon}</span>
              <div className={classes.itemContent}>
                <span className={classes.itemLabel}>{t(option.labelKey)}</span>
                <span className={classes.itemDesc}>{t(option.descKey)}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

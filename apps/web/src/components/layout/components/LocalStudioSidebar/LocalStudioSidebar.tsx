import { WithLoadingSkeleton } from '@novu/novui';
import { IconCloudQueue } from '@novu/novui/icons';
import { css, cx } from '@novu/novui/css';
import { HStack } from '@novu/novui/jsx';

import { useDiscover } from '../../../../studio/hooks/useBridgeAPI';
import { Aside } from '../../../nav/Aside';
import { LocalStudioSidebarContent } from './LocalStudioSidebarContent';
import { SidebarFooter } from './SidebarFooter';
import { FCBase } from '../../../../types';

export const LocalStudioSidebar: WithLoadingSkeleton = () => {
  const { isLoading, data } = useDiscover();

  return (
    <Aside>
      <LocalStudioSidebarContent workflows={data?.workflows ?? []} isLoading={isLoading} />
      <SidebarFooter>
        <HrefButton />
      </SidebarFooter>
    </Aside>
  );
};

/*
 * We need to use href here because in local development, it shouldn't open a new tab as a popup.
 * because of 'Cross-Origin-Opener-Policy': 'same-origin'
 */
export const HrefButton: FCBase = () => {
  return (
    <a href={window.location.origin} target={'_blank'} className={cx(css({}))}>
      <HStack
        className={cx(
          css({
            fontSize: '88',
            fontStyle: 'normal',
            fontWeight: 'strong',
            lineHeight: '125',
            bg: 'transparent',
            justifyContent: 'center',
            borderColor: 'legacy.success',
            border: 'solid',
            borderRadius: '100',
            padding: '50 100 50 100',
            color: { base: 'legacy.B40', _dark: 'legacy.white' },
          })
        )}
      >
        <IconCloudQueue />
        Open Cloud Dashboard
      </HStack>
    </a>
  );
};

LocalStudioSidebar.LoadingDisplay = () => (
  <Aside>
    <LocalStudioSidebarContent.LoadingDisplay />
  </Aside>
);

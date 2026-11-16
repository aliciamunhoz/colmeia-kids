import { useState } from 'react';

import { IconButton, Screen, ScreenHeader } from '@/components';
import { getPortfolio, useData } from '@/data';
import { PortfolioGallery } from '../shared/PortfolioGallery';
import { firstName, useSelectedChild } from './SelectedChildContext';

export function PortfolioScreen() {
  const { data } = useData();
  const { child } = useSelectedChild();
  const [newestFirst, setNewestFirst] = useState(true);

  return (
    <Screen
      header={
        <ScreenHeader
          title="Portfolio"
          subtitle={`${firstName(child.name)} · ${getPortfolio(data, child.id).length} items`}
          right={
            <IconButton
              icon="filter"
              accessibilityLabel={newestFirst ? 'Show oldest first' : 'Show newest first'}
              onPress={() => setNewestFirst((v) => !v)}
            />
          }
        />
      }
    >
      <PortfolioGallery childId={child.id} newestFirst={newestFirst} />
    </Screen>
  );
}

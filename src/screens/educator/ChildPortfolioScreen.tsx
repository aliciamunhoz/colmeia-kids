import { Button, Screen, ScreenHeader } from '@/components';
import { getChild, getPortfolio, useData } from '@/data';
import type { RoomScreenProps } from '@/navigation/types';
import { PortfolioGallery } from '../shared/PortfolioGallery';
import { firstName } from '../parent/SelectedChildContext';

export function ChildPortfolioScreen({ navigation, route }: RoomScreenProps<'ChildPortfolio'>) {
  const { data } = useData();
  const child = getChild(data, route.params.childId);
  if (!child) return null;

  return (
    <Screen
      header={<ScreenHeader title="Portfolio" subtitle={`${firstName(child.name)} · ${getPortfolio(data, child.id).length} items`} />}
    >
      <Button title="Add to portfolio" icon="plus" fullWidth onPress={() => navigation.navigate('AddToPortfolio', { childId: child.id })} />
      <PortfolioGallery childId={child.id} />
    </Screen>
  );
}

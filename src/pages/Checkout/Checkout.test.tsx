import Checkout from './Checkout';
import { render } from '../../tests/setup';

describe('Checkout', () => {
  it('renders the Checkout component', async () => {
    render(<Checkout />, {});
  });
})
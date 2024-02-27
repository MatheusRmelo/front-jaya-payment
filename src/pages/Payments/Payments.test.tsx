import { fireEvent, screen } from '@testing-library/react'
import Payment from './Payments';
import { render } from '../../tests/setup';

describe('Payments', () => {
  it('renders the Payments component', async () => {
    render(<Payment />, {});
    expect(screen.getByText('Pagamentos')).toBeDefined();
    expect(screen.getByText('Novo pagamento')).toBeDefined();
  });

  it('renders a list of payments', async () => {
    render(<Payment />, {});
    const payments = await screen.findAllByRole('row');
    //Check with plus one to remove header row
    expect(payments).toHaveLength(3);
  });

  it('show confirm modal', async () => {
    render(<Payment />, {});
    fireEvent.click(await screen.findByText('Confirmar'))
    expect(screen.getByText('Confirmar pagamento')).toBeDefined();
  });

  it('show cancel modal', async () => {
    render(<Payment />, {});
    fireEvent.click(await screen.findByText('Cancelar'))
    expect(screen.getByText('Cancelar pagamento')).toBeDefined();
  });
})
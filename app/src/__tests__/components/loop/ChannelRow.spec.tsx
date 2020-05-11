import React from 'react';
import { BalanceLevel, Channel } from 'types/state';
import { fireEvent } from '@testing-library/react';
import { ellipseInside } from 'util/strings';
import { renderWithProviders } from 'util/tests';
import ChannelRow from 'components/loop/ChannelRow';

describe('ChannelRow component', () => {
  let channel: Channel;
  const onChange = jest.fn();

  const render = (options?: {
    editable?: boolean;
    checked?: boolean;
    disabled?: boolean;
    dimmed?: boolean;
  }) => {
    return renderWithProviders(
      <ChannelRow
        channel={channel}
        editable={options && options.editable}
        checked={options && options.checked}
        disabled={options && options.disabled}
        dimmed={options && options.dimmed}
        onChange={onChange}
      />,
    );
  };

  beforeEach(() => {
    channel = {
      active: true,
      capacity: 15000000,
      chanId: '150633093070848',
      localBalance: 9990950,
      remoteBalance: 5000000,
      remotePubkey: '02ac59099da6d4bd818e6a81098f5d54580b7c3aa8255c707fa0f95ca89b02cb8c',
      uptime: 97,
      localPercent: 67,
      balancePercent: 67,
      balanceLevel: BalanceLevel.warn,
    };
  });

  it('should display the remote balance', () => {
    const { getByText } = render();
    expect(getByText(channel.remoteBalance.toLocaleString())).toBeInTheDocument();
  });

  it('should display the local balance', () => {
    const { getByText } = render();
    expect(getByText(channel.localBalance.toLocaleString())).toBeInTheDocument();
  });

  it('should display the uptime', () => {
    const { getByText } = render();
    expect(getByText(channel.uptime.toString())).toBeInTheDocument();
  });

  it('should display the peer pubkey', () => {
    const { getByText } = render();
    expect(getByText(ellipseInside(channel.remotePubkey))).toBeInTheDocument();
  });

  it('should display the capacity', () => {
    const { getByText } = render();
    expect(getByText(channel.capacity.toLocaleString())).toBeInTheDocument();
  });

  it('should display correct dot icon for an inactive channel', () => {
    channel.active = false;
    const { getByText, getByLabelText } = render();
    expect(getByText('dot.svg')).toBeInTheDocument();
    expect(getByLabelText('idle')).toBeInTheDocument();
  });

  it.each<[BalanceLevel, string]>([
    [BalanceLevel.good, 'success'],
    [BalanceLevel.warn, 'warn'],
    [BalanceLevel.bad, 'error'],
  ])('should display correct dot icon for a "%s" balance', (level, label) => {
    channel.balanceLevel = level;
    const { getByText, getByLabelText } = render();
    expect(getByText('dot.svg')).toBeInTheDocument();
    expect(getByLabelText(label)).toBeInTheDocument();
  });

  it('should display a checkbox when it is editable', () => {
    const { getByRole } = render({ editable: true });
    expect(getByRole('checkbox')).toBeInTheDocument();
    expect(getByRole('checkbox')).toHaveAttribute('aria-checked', 'false');
  });

  it('should display a checked checkbox when it is checked', () => {
    const { getByRole } = render({ editable: true, checked: true });
    expect(getByRole('checkbox')).toBeInTheDocument();
    expect(getByRole('checkbox')).toHaveAttribute('aria-checked', 'true');
  });

  it('should display a disabled checkbox', () => {
    const { getByRole } = render({ editable: true, disabled: true, dimmed: true });
    expect(getByRole('checkbox')).toBeInTheDocument();
    expect(getByRole('checkbox')).toHaveAttribute('aria-disabled', 'true');
  });

  it('should trigger onChange when it is clicked', () => {
    const { getByRole } = render({ editable: true });
    expect(getByRole('checkbox')).toBeInTheDocument();
    fireEvent.click(getByRole('checkbox'));
    expect(onChange).toBeCalledWith(channel, true);
  });
});
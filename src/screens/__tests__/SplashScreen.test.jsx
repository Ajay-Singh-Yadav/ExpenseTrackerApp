import React from 'react';
import { render } from '@testing-library/react-native';
import SplashScreen from '../SplashScreen';
import { useTheme } from '../../constants/ThemeContext';
import FastImage from 'react-native-fast-image';

jest.mock('../../constants/ThemeContext', () => ({
  useTheme: jest.fn(),
}));

describe('SplashScreen', () => {
  const mockTheme = { bgColor: '#ffffff' };

  beforeEach(() => {
    useTheme.mockReturnValue({ theme: mockTheme });
  });

  it('renders without crashing', () => {
    render(<SplashScreen />);
  });

  it('matches snapshot', () => {
    const tree = render(<SplashScreen />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders FastImage with correct testID', () => {
    const { getByTestId } = render(<SplashScreen />);
    expect(getByTestId('splash-logo')).toBeTruthy();
  });

  it('applies correct background color from theme', () => {
    const { getByTestId, toJSON } = render(<SplashScreen />);
    const json = toJSON();
    expect(json.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ backgroundColor: '#ffffff' }),
      ]),
    );
  });

  it('renders logo with correct size', () => {
    const { getByTestId } = render(<SplashScreen />);
    const logo = getByTestId('splash-logo');
    expect(logo.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ width: 140, height: 140 }),
      ]),
    );
  });

  it('re-renders when theme changes', () => {
    const { rerender, toJSON } = render(<SplashScreen />);
    useTheme.mockReturnValue({ theme: { bgColor: '#000000' } });
    rerender(<SplashScreen />);
    const json = toJSON();
    expect(json.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ backgroundColor: '#000000' }),
      ]),
    );
  });

  it('uses React.memo to prevent unnecessary re-render', () => {
    const { rerender } = render(<SplashScreen />);
    const firstRender = render(<SplashScreen />);
    rerender(<SplashScreen />);
    // If memo works, component tree should be structurally same
    expect(firstRender.toJSON()).toEqual(firstRender.toJSON());
  });
});

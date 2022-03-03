
export const builderSpies = {
  getOverrides: jest.fn(),
  reset: function () {
    this.getoverrides = jest.fn();
  },
};

export const elementSpies = {
  element: {},
  reset: function () {
    this.element = {};
  },
};

export const optionsSpies = {
  events: {},
  reset: function () {
    this.options = {};
  },
};

export const useBuilder = () => {
  return {
    getOverrides: builderSpies.getOverrides,
  };
};

export const useOptions = () => {
  return {
    events: optionsSpies.events,
  };
};

export const useElement = () => {
  return {
    element: elementSpies.element,
  };
};

export { sanitizeHTML, Text } from '@poool/oak';

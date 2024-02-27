import { afterEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import { BrowserRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom/vitest'
import { server } from '../mocks/server';

beforeAll(() => {
    server.listen();
});
// runs a clean after each test case (e.g. clearing jsdom)
afterEach(() => {
    cleanup();
    server.resetHandlers();
});
afterAll(() => {
    server.close();
})

const customRender = (ui: any, options: any) => render(ui, { wrapper: Router, ...options });

export * from '@testing-library/react';

export { customRender as render };
import { ClitestPage } from './app.po';

describe('clitest App', () => {
  let page: ClitestPage;

  beforeEach(() => {
    page = new ClitestPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});

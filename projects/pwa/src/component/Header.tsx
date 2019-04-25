import React from 'react';
import { Link } from '@reach/router';
import { metrics } from '../helper/styles';
import { css } from 'emotion';
import { palette } from '@guardian/pasteup/palette';
import usePageTitle from '../hooks/usePageTitle';
import Wrapper from './layout/Wrapper';
import { headline } from '@guardian/pasteup/typography';

type StyleProps = {
    appearance: Appearances;
};

export type BackLink = {
    title: string;
    url: string;
};

export enum Appearances {
    Brand,
    White,
}

const styles = ({ appearance }: StyleProps) =>
    appearance === Appearances.Brand
        ? css`
              background: ${palette.brand.main};
              color: ${palette.neutral[100]};
              a {
                  color: inherit;
              }
          `
        : css`
              color: ${palette.neutral[7]};
              a {
                  color: ${palette.brand.main};
              }
          `;

const headerStyles = css`
    ${headline(6)};
    margin-top: ${metrics.baseline}px;
    font-weight: 700;
`;

const Header = ({
    backLink,
    children,
    ...styleProps
}: {
    backLink?: BackLink;
    children: string;
} & StyleProps) => {
    usePageTitle(children);
    return (
        <header className={styles(styleProps)}>
            <Wrapper>
                {backLink && (
                    <Link to={backLink.url}>← Return to {backLink.title}</Link>
                )}
                <h1 className={headerStyles}>{children}</h1>
            </Wrapper>
        </header>
    );
};

Header.defaultProps = {
    appearance: Appearances.Brand,
};

export default Header;

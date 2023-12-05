import React, { ReactNode } from 'react';
import { NavLink, LinkProps } from 'react-router-dom';
import { Anchor, AnchorProps } from "@mantine/core";

interface MyLinkProps extends LinkProps {
    children: ReactNode;
    size?: string;
    underline?: AnchorProps['underline'];
    activeClassName?: string;
}

const LinkComponent: React.FC<MyLinkProps> = ({ to, size, underline, activeClassName, children, ...rest }) => {
    return (
        <NavLink to={to} {...rest}>
            {({ isActive }) => (
                <Anchor target="_blank"
                        underline={underline}
                        size={size}
                        className={isActive ? activeClassName : ''}
                        // style={{
                        //     color: isActive ? 'teal' : 'indigo',
                        //     textDecoration: 'none',
                        //     fontWeight: isActive ? 'bold' : 'normal',
                        // }}
                >
                    {children}
                </Anchor>
            )}
        </NavLink>
    );
};

export default LinkComponent;


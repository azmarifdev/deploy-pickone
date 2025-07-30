import { FC } from 'react';
import Image from 'next/image';

const Logo: FC = () => {
    return (
        <Image
            src="/images/logo/ekhoni_kinbo_logo-trans.png"
            alt="Ekhoni Kinbo Logo"
            width={120}
            height={40}
            sizes="120px"
            className="h-8 w-auto"
        />
    );
};

export default Logo;

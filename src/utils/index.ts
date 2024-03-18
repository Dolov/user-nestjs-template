import * as crypto from 'crypto';
import { SetMetadata } from '@nestjs/common'


export const md5 = (str: string) => {
	const hash = crypto.createHash('md5');
	hash.update(str);
	return hash.digest('hex');
}

export const noLoginMetadata = 'not-need-login'

export const NotNeedLogin = () => SetMetadata('not-need-login', true)
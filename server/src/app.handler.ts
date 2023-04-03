import { HookEntity } from './@types';
import { HookBodyDto } from './amo/dto/hook/hook-body.dto';

// TODO переделать в класс

export const getHookEntity = (entity: HookBodyDto): HookEntity => {
  const leadId = entity.event.data.id;
  const text = entity.action.settings.widget.settings.text;

  const userId = entity.action.settings.widget.settings.users;

  const userPicture =
    entity.action.settings.widget.settings.userPicture === ''
      ? ''
      : entity.action.settings.widget.settings.userPicture;

  const sadPicture =
    entity.action.settings.widget.settings.sad === 'true' ? 'sad' : '';

  const resPicturetemp =
    userPicture || sadPicture !== ''
      ? resPictureHandler(userPicture, sadPicture)
      : '';

  const resPicture = resPicturetemp === '' ? '' : resPicturetemp;

  const subDomain = entity.subdomain;
  const isAudio = entity.action.settings.widget.settings.audio;

  return {
    leadId,
    text,
    users: userId,
    picture: resPicture,
    subdomain: subDomain,
    audio: isAudio,
  };
};

const resPictureHandler = (usersPicture = '', sadPicture = '') => {
  if (sadPicture !== '') {
    if (usersPicture !== '') {
      return usersPicture;
    }
    return sadPicture;
  }
  return usersPicture;
};

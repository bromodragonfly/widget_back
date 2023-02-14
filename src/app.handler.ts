import { HookEntity } from './@types';
import { HookBodyDto } from './amo/dto/hook/hook-body.dto';

// TODO можно переделать в класс
// TODO проверить возвращаемый объект на типы
// TODO entity (скорее всего мне уже придет HookData)

export const getHookEntity = (entity: HookBodyDto): HookEntity => {
  //   const userId = req.body.action.settings.widget.settings.users.split(',');
  //   const hookData = entity.body;

  const leadId = entity.event.data.id;
  const text = entity.action.settings.widget.settings.text;

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

import $ from 'cafy';
import ID from '../../../../misc/cafy-id';
import getParams from '../../get-params';
import User from '../../../../models/user';

export const meta = {
  desc: {
    ja: '指定したユーザーを凍結します。',
    en: 'Suspend a user.'
  },

  requireCredential: true,
  requireAdmin: true,

  params: {
    userId: $.type(ID).note({
      desc: {
        ja: '対象のユーザーID',
        en: 'The user ID which you want to suspend'
      }
    }),
  }
};

export default (params: any) => new Promise(async (res, rej) => {
  const [ps, psErr] = getParams(meta, params);
  if (psErr) return rej(psErr);

  const user = await User.findOne({
    _id: ps.userId
  });

  if (user == null) {
    return rej('user not found');
  }

  await User.findOneAndUpdate({
    _id: user._id
  }, {
      $set: {
        isSuspended: true
      }
    });

  res();
});

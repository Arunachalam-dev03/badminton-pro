import Joi from 'joi';
export const loginSchema = Joi.object({ email:Joi.string().email().required(), password:Joi.string().min(4).required() });
export const playerSchema = Joi.object({ name:Joi.string().min(2).required(), country:Joi.string().allow('',null), email:Joi.string().email().allow('',null), phone:Joi.string().allow('',null), hand:Joi.string().valid('R','L','').allow(null) });
export const teamSchema = Joi.object({ name:Joi.string().required(), player1_id:Joi.string().uuid().required(), player2_id:Joi.string().uuid().required() });
export const matchScoreSchema = Joi.object({ score:Joi.string().required(), status:Joi.string().valid('scheduled','in_progress','completed').default('in_progress'), winner_player_id:Joi.string().uuid().allow(null), winner_team_id:Joi.string().uuid().allow(null) });

import { checkMaxBookingsAtSameTime } from './maxBookingsAtSameTime';
import { checkMaxDuration } from './maxDuration';
import { checkMaxTimeBefore } from './maxTimeBefore';
import { checkMinDuration } from './minDuration';
import { checkMinTimeBefore } from './minTimeBefore';
import type { RuleCheckPlugins } from './type';

export const ruleCheckPlugins: RuleCheckPlugins = {
	maxTimeBefore: checkMaxTimeBefore,
	minTimeBefore: checkMinTimeBefore,
	minDuration: checkMinDuration,
	maxDuration: checkMaxDuration,
	maxBookingsAtSameTime: checkMaxBookingsAtSameTime,
};

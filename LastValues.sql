/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/**
 * Author:  012789
 * Created: 15.06.2016
 */

SELECT l.ID, t.Value AS "Temperature", p.Value AS "Power", s.Value AS "SwitchCount", o.Value AS "OperatingTime"
FROM Power p, Temperature t, SwitchCount s, OperatingTime o, Lights l
WHERE t.Timestamp =
	(SELECT max(Timestamp) FROM Temperature WHERE Light_ID = l.ID)
AND p.Timestamp =
	(SELECT max(Timestamp) FROM Power WHERE Light_ID = l.ID)
AND s.Timestamp =
	(SELECT max(Timestamp) FROM SwitchCount WHERE Light_ID = l.ID)
AND o.Timestamp =
        (SELECT max(Timestamp) FROM OperatingTime WHERE Light_ID = l.ID)
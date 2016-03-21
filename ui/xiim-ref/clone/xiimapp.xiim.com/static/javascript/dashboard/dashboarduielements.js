/**
 * @author Next Sphere Technologies
 * 
 * Contains all JSON object with UI Elements for few of the dashbaord widgets.
 * 
 */
var UIElements = function(){
	return{
		myConnectionsUserShortProfile:function(uniqueProfileID,imageURL,memberNamee,profileSummaryy,memberFirstNameAndLastName,userIdd,memberId){
			
			var jsonUIElementData={
					uniqueProfileIDKey:uniqueProfileID,
					imageURLKey: imageURL,
					memberNameeKey: memberNamee,
					profileSummaryyKey:profileSummaryy,
					memberFirstNameAndLastNameKey:memberFirstNameAndLastName,
					userIddKey:userIdd,
					memberIdKey:memberId
				};
			return jsonUIElementData;
			
		},
		groupShortInfo:function(groupReceivedInvitationCount,groupPendingRequestCount,eventInvitationCount,groupLogo,groupId,groupName){
			
			var jsonUIElementData={
					groupReceivedInvitationCountKey:groupReceivedInvitationCount,
					groupPendingRequestCountKey: groupPendingRequestCount,
					eventInvitationCountKey: eventInvitationCount,
					groupLogoKey:groupLogo,
					groupIdKey:groupId,
					groupNameKey:groupName
				};
			return jsonUIElementData;
			
		}
	};
	
}.call(this);



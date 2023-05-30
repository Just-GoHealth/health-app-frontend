import React from 'react';

export const UserRecommendations = ({ recommendation }) => {
	return (
		<>
			<div className="relative">
				<div className="absolute left-[-50px] top-3">
					{recommendation?.icon}
				</div>
				<div>
					<h1 className="text-xl text-[#955AA4]">
						{recommendation?.title}{' '}
						{recommendation?.subTitle && (
							<span>{recommendation?.subTitle}</span>
						)}
					</h1>
					<h4>{recommendation?.body}</h4>
				</div>
			</div>
		</>
	);
};
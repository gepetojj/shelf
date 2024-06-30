import { Prisma } from "@prisma/client";

export type CommentPayload = Prisma.CommentGetPayload<{
	include: {
		owner: {
			select: {
				id: true;
				externalId: true;
				firstName: true;
				lastName: true;
				username: true;
				profileImageUrl: true;
			};
		};
		children: true;
	};
}>;

export type CommentCreateDTO = {
	externalId: string;
	postId: string;
	parentId?: string;
	text: string;
};

export interface CommentService {
	findByPostId(postId: string): Promise<CommentPayload[]>;
	create(data: CommentCreateDTO): Promise<CommentPayload>;
}

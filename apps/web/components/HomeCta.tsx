import Link from "next/link";

import { Button } from "@workspace/ui";

type HomeCtaProps = {
	signedIn: boolean;
};

/**
 * Landing hero actions — never show "Sign in" when the user already has a session.
 */
export function HomeCta({ signedIn }: HomeCtaProps) {
	if (signedIn) {
		return (
			<div className="flex flex-wrap gap-3 pt-1">
				<Link href="/playground">
					<Button size="lg">Continue to Playground</Button>
				</Link>
				<Link href="/dashboard">
					<Button size="lg" variant="secondary">
						Dashboard
					</Button>
				</Link>
			</div>
		);
	}

	return (
		<div className="flex flex-wrap gap-3 pt-1">
			<Link href="/login?callbackUrl=/playground">
				<Button size="lg">Get started</Button>
			</Link>
			<Link href="/login">
				<Button size="lg" variant="secondary">
					Sign in
				</Button>
			</Link>
		</div>
	);
}

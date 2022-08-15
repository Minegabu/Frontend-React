import React, { useState, useEffect, useCallback } from 'react';
import { useSession, getSession } from 'next-auth/react';
import { GetServerSidePropsContext } from 'next';
import Link from 'next/link';

const Vote = () => {
    const { data: session } = useSession();
    const [selection, setSelection] = useState<number | null>(null);
    const [names, setNames] = useState<string[]>([]);
    const [existvote, setExistVote] = useState();
    const fetchData = useCallback(async () => {
        if (session) {
            const { data }: { data: any[] } = await fetch(`http://localhost:1234/api/get-candidate/${encodeURIComponent(session?.user?.email)}`).then((response) => response.json());
            const candidatenames = data[1];
            setNames(candidatenames.map((candidate) => candidate.name));
            setExistVote(data[0]);
        }
    }, [session]);

    const onSenddata = async () => {
        if (session) {
            if (selection != null) {
                await fetch('http://localhost:1234/api/vote/update', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        vote: names[selection],
                        name: session.user?.name,
                    }),
                });
            }
        }
    };

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <>
            {
                session
                    ? (
                        <>
                            <div id="background-image" />
                            <div className="card-overlay">
                                <div id="navbar">
                                    <nav>
                                        <a href="/">Home</a>
                                        <a id="selectednav" href="/vote">Vote</a>
                                        <a href="/about">About</a>
                                        <a href="/candidates">Candidates</a>
                                        <a href="/"><img src={session.user.image} referrerPolicy="no-referrer" className="img-fluid" alt="userprofile" /></a>
                                    </nav>
                                </div>
                                <div id="Header">
                                    <h1> Please vote for a student council representative</h1>
                                </div>
                                <div id="hi">
                                    <form id="formforvote">
                                        <div id="hi4">
                                            <select
                                                value={selection !== null ? names[selection] : 'Select Candidate'}
                                                onChange={(e) => {
                                                    const index = names.indexOf(e.target.value);
                                                    if (index >= 0) {
                                                        setSelection(index);
                                                    } else {
                                                        setSelection(null);
                                                    }
                                                }}
                                                id="Selectvotedropdown"
                                            >
                                                <option value="defaultoption"> Choose an option </option>
                                                {names.map((name) => (
                                                    <option id={name} value={name}>
                                                        {name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        {selection !== null && existvote === null && (
                                            <div id="hi2">
                                                <Link href="/submittedvote">
                                                    <button type="submit" onClick={onSenddata}>
                                                        Vote for
                                                        {' '}
                                                        {names[selection]}
                                                    </button>

                                                </Link>
                                            </div>
                                        )}
                                        {selection !== null && existvote !== null && (
                                            <>
                                                <div id="hi2">
                                                    <Link href="/submittedvote">
                                                        <button type="submit" onClick={onSenddata}>
                                                            Update Vote to
                                                            {' '}
                                                            {names[selection]}
                                                        </button>
                                                    </Link>
                                                </div>
                                            </>
                                        )}
                                    </form>
                                </div>
                                {existvote !== null && (
                                    <div>
                                        <b>
                                            {' '}
                                            You have voted for
                                            {' '}
                                            {existvote}
                                            {' '}
                                        </b>
                                    </div>
                                )}
                            </div>
                        </>
                    )
                    : (
                        <>
                            <div className="card-overlay">

                                <p>
                                    {' '}
                                    You are not signed in
                                    <br />
                                </p>
                                <p>
                                    {' '}
                                    Please go to the homepage and login
                                    <br />
                                </p>
                                <a href="/"> Go Back </a>
                            </div>
                        </>
                    )

            }

        </>
    );
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
    const session = await getSession(ctx);
    return ({ props: { session } });
}

export default Vote;

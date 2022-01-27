package command

import (
	"context"
	"testing"
	"time"

	"github.com/caos/zitadel/internal/config/types"
	"github.com/caos/zitadel/internal/crypto"
	"github.com/stretchr/testify/assert"

	"github.com/caos/zitadel/internal/domain"
	caos_errs "github.com/caos/zitadel/internal/errors"
	"github.com/caos/zitadel/internal/eventstore"
	"github.com/caos/zitadel/internal/eventstore/repository"
	"github.com/caos/zitadel/internal/repository/iam"
)

func TestCommandSide_AddSecretGenerator(t *testing.T) {
	type fields struct {
		eventstore *eventstore.Eventstore
	}
	type args struct {
		ctx           context.Context
		generator     *crypto.GeneratorConfig
		generatorType string
	}
	type res struct {
		want *domain.ObjectDetails
		err  func(error) bool
	}
	tests := []struct {
		name   string
		fields fields
		args   args
		res    res
	}{
		{
			name: "invalid empty type, error",
			fields: fields{
				eventstore: eventstoreExpect(
					t,
				),
			},
			args: args{
				ctx:       context.Background(),
				generator: &crypto.GeneratorConfig{},
			},
			res: res{
				err: caos_errs.IsErrorInvalidArgument,
			},
		},
		{
			name: "secret generator config, error already exists",
			fields: fields{
				eventstore: eventstoreExpect(
					t,
					expectFilter(
						eventFromEventPusher(
							iam.NewSecretGeneratorAddedEvent(context.Background(),
								&iam.NewAggregate().Aggregate,
								"CONFIG",
								4,
								time.Hour*1,
								true,
								true,
								true,
								true,
							),
						),
					),
					expectPushFailed(caos_errs.ThrowAlreadyExists(nil, "ERROR", "internl"),
						[]*repository.Event{
							eventFromEventPusher(iam.NewSecretGeneratorAddedEvent(
								context.Background(),
								&iam.NewAggregate().Aggregate,
								"CONFIG",
								4,
								time.Hour*1,
								true,
								true,
								true,
								true,
							),
							),
						},
						uniqueConstraintsFromEventConstraint(iam.NewAddSecretGeneratorTypeUniqueConstraint("CONFIG")),
					),
				),
			},
			args: args{
				ctx: context.Background(),
				generator: &crypto.GeneratorConfig{
					Length:              4,
					Expiry:              types.Duration{Duration: time.Hour * 1},
					IncludeLowerLetters: true,
					IncludeUpperLetters: true,
					IncludeDigits:       true,
					IncludeSymbols:      true,
				},
				generatorType: "CONFIG",
			},
			res: res{
				err: caos_errs.IsErrorAlreadyExists,
			},
		},
		{
			name: "add secret generator, ok",
			fields: fields{
				eventstore: eventstoreExpect(
					t,
					expectFilter(),
					expectPush(
						[]*repository.Event{
							eventFromEventPusher(iam.NewSecretGeneratorAddedEvent(
								context.Background(),
								&iam.NewAggregate().Aggregate,
								"CONFIG",
								4,
								time.Hour*1,
								true,
								true,
								true,
								true,
							),
							),
						},
						uniqueConstraintsFromEventConstraint(iam.NewAddSecretGeneratorTypeUniqueConstraint("CONFIG")),
					),
				),
			},
			args: args{
				ctx: context.Background(),
				generator: &crypto.GeneratorConfig{
					Length:              4,
					Expiry:              types.Duration{Duration: time.Hour * 1},
					IncludeLowerLetters: true,
					IncludeUpperLetters: true,
					IncludeDigits:       true,
					IncludeSymbols:      true,
				},
				generatorType: "CONFIG",
			},
			res: res{
				want: &domain.ObjectDetails{
					ResourceOwner: "IAM",
				},
			},
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			r := &Commands{
				eventstore: tt.fields.eventstore,
			}
			got, err := r.AddSecretGeneratorConfig(tt.args.ctx, tt.args.generatorType, tt.args.generator)
			if tt.res.err == nil {
				assert.NoError(t, err)
			}
			if tt.res.err != nil && !tt.res.err(err) {
				t.Errorf("got wrong err: %v ", err)
			}
			if tt.res.err == nil {
				assert.Equal(t, tt.res.want, got)
			}
		})
	}
}

func TestCommandSide_ChangeSecretGenerator(t *testing.T) {
	type fields struct {
		eventstore *eventstore.Eventstore
	}
	type args struct {
		ctx           context.Context
		generator     *crypto.GeneratorConfig
		generatorType string
	}
	type res struct {
		want *domain.ObjectDetails
		err  func(error) bool
	}
	tests := []struct {
		name   string
		fields fields
		args   args
		res    res
	}{
		{
			name: "empty generatortype, invalid error",
			fields: fields{
				eventstore: eventstoreExpect(
					t,
				),
			},
			args: args{
				ctx:           context.Background(),
				generator:     &crypto.GeneratorConfig{},
				generatorType: "",
			},
			res: res{
				err: caos_errs.IsErrorInvalidArgument,
			},
		},
		{
			name: "generator not existing, not found error",
			fields: fields{
				eventstore: eventstoreExpect(
					t,
					expectFilter(),
				),
			},
			args: args{
				ctx:           context.Background(),
				generatorType: "CONFIG",
			},
			res: res{
				err: caos_errs.IsNotFound,
			},
		},
		{
			name: "generator removed, not found error",
			fields: fields{
				eventstore: eventstoreExpect(
					t,
					expectFilter(
						eventFromEventPusher(
							iam.NewSecretGeneratorAddedEvent(
								context.Background(),
								&iam.NewAggregate().Aggregate,
								"CONFIG",
								4,
								time.Hour*1,
								true,
								true,
								true,
								true,
							),
						),
						eventFromEventPusher(
							iam.NewSecretGeneratorRemovedEvent(context.Background(),
								&iam.NewAggregate().Aggregate,
								"CONFIG"),
						),
					),
				),
			},
			args: args{
				ctx:           context.Background(),
				generatorType: "CONFIG",
			},
			res: res{
				err: caos_errs.IsNotFound,
			},
		},
		{
			name: "no changes, precondition error",
			fields: fields{
				eventstore: eventstoreExpect(
					t,
					expectFilter(
						eventFromEventPusher(
							iam.NewSecretGeneratorAddedEvent(
								context.Background(),
								&iam.NewAggregate().Aggregate,
								"CONFIG",
								4,
								time.Hour*1,
								true,
								true,
								true,
								true,
							),
						),
					),
				),
			},
			args: args{
				ctx: context.Background(),
				generator: &crypto.GeneratorConfig{
					Length:              4,
					Expiry:              types.Duration{Duration: time.Hour * 1},
					IncludeLowerLetters: true,
					IncludeUpperLetters: true,
					IncludeDigits:       true,
					IncludeSymbols:      true,
				},
				generatorType: "CONFIG",
			},
			res: res{
				err: caos_errs.IsPreconditionFailed,
			},
		},
		{
			name: "secret generator change, ok",
			fields: fields{
				eventstore: eventstoreExpect(
					t,
					expectFilter(
						eventFromEventPusher(
							iam.NewSecretGeneratorAddedEvent(
								context.Background(),
								&iam.NewAggregate().Aggregate,
								"CONFIG",
								4,
								time.Hour*1,
								true,
								true,
								true,
								true,
							),
						),
					),
					expectPush(
						[]*repository.Event{
							eventFromEventPusher(
								newSecretGeneratorChangedEvent(context.Background(),
									"CONFIG",
									8,
									time.Hour*2,
									false,
									false,
									false,
									false),
							),
						},
					),
				),
			},
			args: args{
				ctx: context.Background(),
				generator: &crypto.GeneratorConfig{
					Length:              8,
					Expiry:              types.Duration{Duration: time.Hour * 2},
					IncludeLowerLetters: false,
					IncludeUpperLetters: false,
					IncludeDigits:       false,
					IncludeSymbols:      false,
				},
				generatorType: "CONFIG",
			},
			res: res{
				want: &domain.ObjectDetails{
					ResourceOwner: "IAM",
				},
			},
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			r := &Commands{
				eventstore: tt.fields.eventstore,
			}
			got, err := r.ChangeSecretGeneratorConfig(tt.args.ctx, tt.args.generatorType, tt.args.generator)
			if tt.res.err == nil {
				assert.NoError(t, err)
			}
			if tt.res.err != nil && !tt.res.err(err) {
				t.Errorf("got wrong err: %v ", err)
			}
			if tt.res.err == nil {
				assert.Equal(t, tt.res.want, got)
			}
		})
	}
}

func TestCommandSide_RemoveSecretGenerator(t *testing.T) {
	type fields struct {
		eventstore *eventstore.Eventstore
	}
	type args struct {
		ctx           context.Context
		generatorType string
	}
	type res struct {
		want *domain.ObjectDetails
		err  func(error) bool
	}
	tests := []struct {
		name   string
		fields fields
		args   args
		res    res
	}{
		{
			name: "empty type, invalid error",
			fields: fields{
				eventstore: eventstoreExpect(
					t,
				),
			},
			args: args{
				ctx:           context.Background(),
				generatorType: "",
			},
			res: res{
				err: caos_errs.IsErrorInvalidArgument,
			},
		},
		{
			name: "generator not existing, not found error",
			fields: fields{
				eventstore: eventstoreExpect(
					t,
					expectFilter(),
				),
			},
			args: args{
				ctx:           context.Background(),
				generatorType: "CONFIG",
			},
			res: res{
				err: caos_errs.IsNotFound,
			},
		},
		{
			name: "generator removed, not found error",
			fields: fields{
				eventstore: eventstoreExpect(
					t,
					expectFilter(
						eventFromEventPusher(
							iam.NewSecretGeneratorAddedEvent(
								context.Background(),
								&iam.NewAggregate().Aggregate,
								"CONFIG",
								4,
								time.Hour*1,
								true,
								true,
								true,
								true,
							),
						),
						eventFromEventPusher(
							iam.NewSecretGeneratorRemovedEvent(context.Background(),
								&iam.NewAggregate().Aggregate,
								"CONFIG"),
						),
					),
				),
			},
			args: args{
				ctx:           context.Background(),
				generatorType: "CONFIG",
			},
			res: res{
				err: caos_errs.IsNotFound,
			},
		},
		{
			name: "generator config remove, ok",
			fields: fields{
				eventstore: eventstoreExpect(
					t,
					expectFilter(
						eventFromEventPusher(
							iam.NewSecretGeneratorAddedEvent(
								context.Background(),
								&iam.NewAggregate().Aggregate,
								"CONFIG",
								4,
								time.Hour*1,
								true,
								true,
								true,
								true,
							),
						),
					),
					expectPush(
						[]*repository.Event{
							eventFromEventPusher(
								iam.NewSecretGeneratorRemovedEvent(context.Background(),
									&iam.NewAggregate().Aggregate,
									"CONFIG"),
							),
						},
						uniqueConstraintsFromEventConstraint(iam.NewRemoveSecretGeneratorTypeUniqueConstraint("CONFIG")),
					),
				),
			},
			args: args{
				ctx:           context.Background(),
				generatorType: "CONFIG",
			},
			res: res{
				want: &domain.ObjectDetails{
					ResourceOwner: "IAM",
				},
			},
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			r := &Commands{
				eventstore: tt.fields.eventstore,
			}
			got, err := r.RemoveSecretGeneratorConfig(tt.args.ctx, tt.args.generatorType)
			if tt.res.err == nil {
				assert.NoError(t, err)
			}
			if tt.res.err != nil && !tt.res.err(err) {
				t.Errorf("got wrong err: %v ", err)
			}
			if tt.res.err == nil {
				assert.Equal(t, tt.res.want, got)
			}
		})
	}
}

func newSecretGeneratorChangedEvent(ctx context.Context, generatorType string, length uint, expiry time.Duration, lowerCase, upperCase, digits, symbols bool) *iam.SecretGeneratorChangedEvent {
	changes := []iam.SecretGeneratorChanges{
		iam.ChangeSecretGeneratorLength(length),
		iam.ChangeSecretGeneratorExpiry(expiry),
		iam.ChangeSecretGeneratorIncludeLowerLetters(lowerCase),
		iam.ChangeSecretGeneratorIncludeUpperLetters(upperCase),
		iam.ChangeSecretGeneratorIncludeDigits(digits),
		iam.ChangeSecretGeneratorIncludeSymbols(symbols),
	}
	event, _ := iam.NewSecretGeneratorChangeEvent(ctx,
		&iam.NewAggregate().Aggregate,
		generatorType,
		changes,
	)
	return event
}
